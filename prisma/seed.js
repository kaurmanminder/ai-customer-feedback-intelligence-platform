const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing database data...');
  // Delete in reverse order of dependency
  await prisma.embedding.deleteMany({});
  await prisma.feedbackTheme.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.theme.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.workspace.deleteMany({});

  console.log('Seeding database...');

  // 1. Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Acme Corp',
    },
  });
  console.log(`Created Workspace: ${workspace.name} (${workspace.id})`);

  // 2. Create User
  const passwordHash = bcrypt.hashSync('password123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: passwordHash,
      phoneNumber: '+15555551234',
      role: 'ADMIN',
      bio: 'Administrator account for Feedback Loop.',
      workspaceId: workspace.id,
    },
  });
  console.log(`Created User: ${user.email}`);

  const analystUser = await prisma.user.create({
    data: {
      name: 'Analyst User',
      email: 'analyst@example.com',
      passwordHash: passwordHash,
      phoneNumber: '+15555555678',
      role: 'ANALYST',
      bio: 'Analyst account for Feedback Loop.',
      workspaceId: workspace.id,
    },
  });
  console.log(`Created User: ${analystUser.email}`);

  const viewerUser = await prisma.user.create({
    data: {
      name: 'Viewer User',
      email: 'viewer@example.com',
      passwordHash: passwordHash,
      phoneNumber: '+15555559012',
      role: 'VIEWER',
      bio: 'Viewer account for Feedback Loop.',
      workspaceId: workspace.id,
    },
  });
  console.log(`Created User: ${viewerUser.email}`);

  // 3. Create Themes
  const themesData = [
    { name: 'Performance', color: 'emerald', description: 'Speed, responsiveness, and page load time.' },
    { name: 'Bug', color: 'red', description: 'Application crashes, errors, or unexpected behavior.' },
    { name: 'Integrations', color: 'blue', description: 'HubSpot, Salesforce, Slack, or other third-party connections.' },
    { name: 'Pricing', color: 'amber', description: 'Subscription plans, billing, or feature tiers.' },
    { name: 'Support', color: 'purple', description: 'Customer service quality, response speed, and efficacy.' },
  ];

  const themes = {};
  for (const themeInfo of themesData) {
    const theme = await prisma.theme.create({
      data: {
        name: themeInfo.name,
        color: themeInfo.color,
        description: themeInfo.description,
        workspaceId: workspace.id,
      },
    });
    themes[themeInfo.name] = theme;
  }
  console.log('Created Themes:', Object.keys(themes));

  // 4. Create Feedbacks
  const feedbacksData = [
    {
      content: 'The new dashboard is incredible! It loads in less than a second and the AI summary is super accurate. Best analytics tool we have used.',
      channel: 'Web',
      sentiment: 'POS',
      sentimentScore: 0.95,
      status: 'REVIEWED',
      themeLinks: [{ themeName: 'Performance', confidence: 0.98 }]
    },
    {
      content: 'The application crashes every time I try to upload a CSV file with customer feedback. This is a critical bug blocking our migration!',
      channel: 'Email',
      sentiment: 'NEG',
      sentimentScore: 0.88,
      status: 'NEW',
      themeLinks: [{ themeName: 'Bug', confidence: 0.95 }]
    },
    {
      content: 'Can we get an integration with HubSpot? We store all our contact feedback there and it would be great to sync it automatically.',
      channel: 'Web',
      sentiment: 'NEU',
      sentimentScore: 0.50,
      status: 'NEW',
      themeLinks: [{ themeName: 'Integrations', confidence: 0.90 }]
    },
    {
      content: 'I think the pricing is a bit high for small teams. The features are great, but $99/mo is hard to justify when we only have 3 users.',
      channel: 'Intercom',
      sentiment: 'NEG',
      sentimentScore: 0.65,
      status: 'NEW',
      themeLinks: [{ themeName: 'Pricing', confidence: 0.85 }]
    },
    {
      content: 'Customer support responded within 5 minutes and solved my login issue. Very impressed with the speed of service.',
      channel: 'Chat',
      sentiment: 'POS',
      sentimentScore: 0.92,
      status: 'ACTIONED',
      themeLinks: [{ themeName: 'Support', confidence: 0.96 }]
    }
  ];

  for (const feedbackInfo of feedbacksData) {
    const feedback = await prisma.feedback.create({
      data: {
        content: feedbackInfo.content,
        channel: feedbackInfo.channel,
        sentiment: feedbackInfo.sentiment,
        sentimentScore: feedbackInfo.sentimentScore,
        status: feedbackInfo.status,
        workspaceId: workspace.id,
      },
    });

    for (const link of feedbackInfo.themeLinks) {
      await prisma.feedbackTheme.create({
        data: {
          feedbackId: feedback.id,
          themeId: themes[link.themeName].id,
          confidence: link.confidence,
        },
      });
    }
  }

  console.log('Seeded Feedbacks and Feedback-Theme links successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
