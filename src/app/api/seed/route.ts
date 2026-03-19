import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        name: "Admin User",
        password: adminPassword,
        role: "ADMIN",
      },
    });

    // Create regular users
    const userPassword = await bcrypt.hash("user123", 12);
    const user1 = await prisma.user.upsert({
      where: { email: "user1@example.com" },
      update: {},
      create: {
        email: "user1@example.com",
        name: "田中 太郎",
        password: userPassword,
        role: "USER",
      },
    });

    await prisma.user.upsert({
      where: { email: "user2@example.com" },
      update: {},
      create: {
        email: "user2@example.com",
        name: "佐藤 花子",
        password: userPassword,
        role: "USER",
      },
    });

    // Create system agents
    for (const data of [
      {
        name: "Deep Research",
        description: "This agent gathers, analyzes, and understands information from various sources to provide comprehensive research results.",
        iconColor: "#0d9488",
        category: "SYSTEM" as const,
        status: "PUBLISHED" as const,
        isPublic: true,
        systemPrompt: "You are a research assistant. Help users find and analyze information comprehensively.",
        createdById: admin.id,
      },
      {
        name: "Idea Generation",
        description: "This agent helps with innovation and problem-solving by generating creative ideas and suggestions.",
        iconColor: "#8b5cf6",
        category: "SYSTEM" as const,
        status: "PUBLISHED" as const,
        isPublic: true,
        systemPrompt: "You are a creative assistant. Help users brainstorm and generate innovative ideas.",
        createdById: admin.id,
      },
      {
        name: "NotebookLM",
        description: "AIを活用して、調査の要約やメモをすばやく作成できます。",
        iconColor: "#374151",
        category: "SYSTEM" as const,
        status: "PUBLISHED" as const,
        isPublic: true,
        systemPrompt: "You are a note-taking assistant. Help users summarize research and create organized notes.",
        createdById: admin.id,
      },
    ]) {
      await prisma.agent.create({ data });
    }

    // Create organization agents
    const ceoAgent = await prisma.agent.create({
      data: {
        name: "CEO アシスタント",
        description: "経営陣のミーティング準備やスケジュール管理をサポートするエージェントです。",
        iconColor: "#dc2626",
        category: "ORGANIZATION",
        status: "PUBLISHED",
        isPublic: true,
        systemPrompt: "あなたはCEOのアシスタントです。経営会議の準備、スケジュール管理、重要な意思決定のサポートを行います。",
        createdById: admin.id,
      },
    });

    await prisma.agent.create({
      data: {
        name: "Short Video Agent v4",
        description: "ショート動画の企画・構成・スクリプト作成をサポートするエージェントです。",
        iconColor: "#7c3aed",
        category: "ORGANIZATION",
        status: "PUBLISHED",
        isPublic: true,
        systemPrompt: "あなたはショート動画制作の専門家です。動画の企画、構成、スクリプト作成をサポートします。",
        createdById: admin.id,
      },
    });

    const customerSupport = await prisma.agent.create({
      data: {
        name: "カスタマーサポート",
        description: "お客様からのお問い合わせに対応するサポートエージェントです。",
        iconColor: "#2563eb",
        category: "ORGANIZATION",
        status: "PUBLISHED",
        isPublic: false,
        systemPrompt: "あなたはカスタマーサポートの担当者です。丁寧で迅速な対応を心がけてください。",
        createdById: admin.id,
      },
    });

    // Grant access
    await prisma.agentAccess.create({
      data: { userId: user1.id, agentId: customerSupport.id },
    });

    // Personal draft
    await prisma.agent.create({
      data: {
        name: "Marketing Bot",
        description: "マーケティング施策の立案をサポート",
        iconColor: "#f59e0b",
        category: "PERSONAL",
        status: "DRAFT",
        createdById: user1.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Seed completed!",
      credentials: {
        admin: "admin@example.com / admin123",
        user1: "user1@example.com / user123",
        user2: "user2@example.com / user123",
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
