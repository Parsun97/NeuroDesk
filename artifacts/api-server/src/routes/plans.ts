import { Router } from "express";

const router = Router();

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 4,
    priceYearly: 3.2,
    chatbotLimit: 1,
    messageLimit: 500,
    features: [
      "1 chatbot",
      "500 messages/month",
      "Website training",
      "PDF upload",
      "Basic analytics",
      "Standard support",
      "NeuroDesk branding",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 9,
    priceYearly: 7.5,
    chatbotLimit: 5,
    messageLimit: 5000,
    features: [
      "5 chatbots",
      "5,000 messages/month",
      "Advanced analytics",
      "Remove branding",
      "Lead generation",
      "Priority support",
      "AI memory",
      "Team access",
      "API access",
      "Custom colors",
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    priceMonthly: 20,
    priceYearly: 16.67,
    chatbotLimit: null,
    messageLimit: 25000,
    features: [
      "Unlimited chatbots",
      "25,000 messages/month",
      "White-label chatbot",
      "Advanced AI training",
      "Team collaboration",
      "CRM integrations",
      "Webhook support",
      "Custom domains",
      "Premium support",
      "Conversation exports",
      "Custom AI instructions",
      "Analytics dashboard",
    ],
    popular: false,
  },
];

router.get("/plans", (_req, res) => {
  res.json(PLANS);
});

export default router;
