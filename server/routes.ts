import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || "super-secret-key-123";

// Middleware to verify JWT
const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

async function seedLawyers() {
  const lawyers = [
    {
      name: "Adv. Rajesh Kumar",
      email: "rajesh.legal@example.com",
      phone: "9876543210",
      password: await bcrypt.hash("lawyer123", 10),
      role: "lawyer",
      barCouncilId: "BCI/12345/2010",
      specialization: "Property Law",
      experience: 15,
      fee: 1500,
      about: "Expert in property verification, documentation, and dispute resolution with over 15 years of experience in high court matters."
    },
    {
      name: "Adv. Priya Sharma",
      email: "priya.family@example.com",
      phone: "9876543211",
      password: await bcrypt.hash("lawyer123", 10),
      role: "lawyer",
      barCouncilId: "BCI/67890/2015",
      specialization: "Family Law",
      experience: 8,
      fee: 1000,
      about: "Specializes in helping families resolve disputes peacefully. Expert in marriage, divorce, and child custody matters."
    },
    {
      name: "Adv. Amit Verma",
      email: "amit.cyber@example.com",
      phone: "9876543212",
      password: await bcrypt.hash("lawyer123", 10),
      role: "lawyer",
      barCouncilId: "BCI/11223/2018",
      specialization: "Cyber Crime",
      experience: 5,
      fee: 1200,
      about: "Focuses on digital safety, online fraud, and data protection. Helps victims of online scams recover their dignity and funds."
    },
    {
      name: "Adv. Sunita Devi",
      email: "sunita.rights@example.com",
      phone: "9876543213",
      password: await bcrypt.hash("lawyer123", 10),
      role: "lawyer",
      barCouncilId: "BCI/44556/2012",
      specialization: "Women Protection",
      experience: 12,
      fee: 800,
      about: "Dedicated to protecting women's rights. Provides supportive and strong legal representation for domestic and workplace issues."
    }
  ];

  for (const lawyer of lawyers) {
    const existing = await storage.getUserByEmail(lawyer.email);
    if (!existing) {
      await storage.createUser(lawyer);
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed initial lawyers
  seedLawyers().catch(console.error);

  // Auth routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByEmail(input.email);
      if (existing) {
        return res.status(400).json({ message: "Email already exists", field: "email" });
      }
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await storage.createUser({ ...input, password: hashedPassword });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      res.status(201).json({ token, user });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(input.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.auth.me.path, authenticate, async (req: any, res) => {
    res.status(200).json(req.user);
  });

  app.patch(api.auth.updateProfile.path, authenticate, async (req: any, res) => {
    try {
      const input = api.auth.updateProfile.input.parse(req.body);
      const updatedUser = await storage.updateUser(req.user.id, input);
      res.status(200).json(updatedUser);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Lawyers
  app.get(api.lawyers.list.path, async (req, res) => {
    try {
      const specialization = req.query.specialization as string | undefined;
      const lawyers = await storage.getLawyers(specialization);
      // Omit passwords
      const safeLawyers = lawyers.map(l => {
        const { password, ...safe } = l;
        return safe;
      });
      res.status(200).json(safeLawyers);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Cases
  app.get(api.cases.list.path, authenticate, async (req: any, res) => {
    try {
      let cases = [];
      if (req.user.role === 'lawyer') {
        cases = await storage.getCasesByLawyer(req.user.id);
      } else {
        cases = await storage.getCasesByUser(req.user.id);
      }
      
      // Enrich with lawyer/user info
      const enrichedCases = await Promise.all(cases.map(async (c) => {
        const lawyer = await storage.getUser(c.lawyerId);
        const user = await storage.getUser(c.userId);
        return {
          ...c,
          lawyer: lawyer ? { id: lawyer.id, name: lawyer.name, specialization: lawyer.specialization } : null,
          user: user ? { id: user.id, name: user.name } : null
        };
      }));
      
      res.status(200).json(enrichedCases);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.cases.create.path, authenticate, async (req: any, res) => {
    try {
      const input = api.cases.create.input.parse(req.body);
      // ensure user is creating case for themselves
      if (input.userId !== req.user.id && req.user.role !== 'lawyer') {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const newCase = await storage.createCase(input);
      res.status(201).json(newCase);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.cases.update.path, authenticate, async (req: any, res) => {
    try {
      const input = api.cases.update.input.parse(req.body);
      const caseId = parseInt(req.params.id);
      const c = await storage.getCase(caseId);
      if (!c) {
        return res.status(404).json({ message: "Case not found" });
      }
      if (c.lawyerId !== req.user.id && c.userId !== req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const updatedCase = await storage.updateCase(caseId, input.status);
      res.status(200).json(updatedCase);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI Mock
  app.post(api.ai.chat.path, async (req, res) => {
    try {
      const input = api.ai.chat.input.parse(req.body);
      const msg = input.message.toLowerCase();
      let reply = "Hello! I'm here to help you understand your legal situation in simple words. Could you tell me a bit more about what happened?";
      
      if (msg.includes("cheat") || msg.includes("money") || msg.includes("fraud")) {
        reply = "If someone took your money and didn't give what they promised, this might be cheating. Here's what you can do: 1) Keep all messages and payment proofs. 2) You can go to your local police station and file a complaint. Don't worry, they will help you note down what happened.";
      } else if (msg.includes("family") || msg.includes("divorce") || msg.includes("marriage")) {
        reply = "Family issues can be stressful. If you're thinking about separation, it's best to talk to a family lawyer who can explain how property and children's care works. You'll need your marriage certificate and basic identity documents.";
      } else if (msg.includes("property") || msg.includes("land") || msg.includes("house") || msg.includes("rent")) {
        reply = "Property matters involve a lot of papers. Before buying or selling, or if someone is claiming your land, always make sure you have the 'sale deed' (the main ownership paper). A lawyer can check if all papers are clear.";
      } else if (msg.includes("job") || msg.includes("salary") || msg.includes("work")) {
        reply = "If your office hasn't paid you, this is against the rules. First, write a polite email to them asking for your salary. If they still don't pay, you have the right to send them a legal notice. Keep your offer letter and bank statements safe.";
      } else if (msg.includes("abuse") || msg.includes("hurt") || msg.includes("hit") || msg.includes("harass")) {
        reply = "I'm very sorry you're going through this. No one has the right to hurt you. You have strong laws protecting you. Please go to the nearest police station or call the women's helpline. You can also file a case under domestic violence laws, and the police are required to register your complaint immediately.";
      }
      
      res.status(200).json({ reply });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
