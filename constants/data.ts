import { CategoryType, ExpenseCategoriesType } from "@/types";
import { colors } from "./theme";

import * as Icons from "phosphor-react-native"; // Import all icons dynamically

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Groceries",
    value: "groceries",
    icon: Icons.ShoppingCart,
    bgColor: "#4B5563", // Deep Teal Green
  },
  rent: {
    label: "Rent",
    value: "rent",
    icon: Icons.House,
    bgColor: "#075985", // Dark Blue
  },
  utilities: {
    label: "Utilities",
    value: "utilities",
    icon: Icons.Lightbulb,
    bgColor: "#ca8a04", // Dark Golden Brown
  },
  transportation: {
    label: "Transportation",
    value: "transportation",
    icon: Icons.Car,
    bgColor: "#b45309", // Dark Orange-Red
  },
  entertainment: {
    label: "Entertainment",
    value: "entertainment",
    icon: Icons.FilmStrip,
    bgColor: "#0f766e", // Darker Red-Brown
  },
  dining: {
    label: "Dining",
    value: "dining",
    icon: Icons.ForkKnife,
    bgColor: "#be185d", // Dark Red
  },
  health: {
    label: "Health",
    value: "health",
    icon: Icons.Heart,
    bgColor: "#e11d48", // Dark Purple
  },
  shopping: {
    label: "Shopping",
    value: "shopping",
    icon: Icons.ShoppingCart,
    bgColor: "#7c3aed", // Dark Indigo
  },
  school: {
    label: "School",
    value: "school",
    icon: Icons.Student,
    bgColor: "#0f766e", // Darker Red-Brown
  },
  wages: {
    label: "Wages",
    value: "wages",
    icon: Icons.CookingPot,
    bgColor: "#404040", // Dark Gray
  },
  transfers: {
    label: "Transfers",
    value: "transfers",
    icon: Icons.ArrowsCounterClockwise,
    bgColor: "#404040", // Dark Gray
  },
  support: {
    label: "Support",
    value: "support",
    icon: Icons.FirstAid,
    bgColor: "#065F46", // Deep Teal Green
  },
  savings: {
    label: "Savings",
    value: "savings",
    icon: Icons.PiggyBank,
    bgColor: "#065F46", // Deep Teal Green
  },
  clothing: {
    label: "Clothing",
    value: "clothing",
    icon: Icons.TShirt,
    bgColor: "#7c3aed", // Dark Indigo
  },
  personal: {
    label: "Personal",
    value: "personal",
    icon: Icons.User,
    bgColor: "#a21caf", // Deep Pink
  },
  homecash: {
    label: "Homecash",
    value: "homecash",
    icon: Icons.Money,
    bgColor: "#065F46", // Deep Teal Green
  },
  others: {
    label: "Others",
    value: "others",
    icon: Icons.DotsThreeOutline,
    bgColor: "#525252", // Neutral Dark Gray
  },
};

export const incomeCategory: CategoryType = {
  label: "Income",
  value: "income",
  icon: Icons.Money,
  // icon: Icons.CurrencyDollarSimple,
  bgColor: "#16a34a", // Dark
};

export const transactionTypes = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];
