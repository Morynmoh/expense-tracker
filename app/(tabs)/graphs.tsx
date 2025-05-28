import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { useAuth } from "@/contexts/authContext";
import { PieChart } from "react-native-gifted-charts";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { TransactionType } from "@/types";
import { expenseCategories } from "@/constants/data";
import { formatNumber } from "@/utils/common";
import Loading from "@/components/Loading";
import * as Icons from "phosphor-react-native";
import { BlurView } from "expo-blur";

const { width: screenWidth } = Dimensions.get("window");

const CustomLabel = ({ x, y, text, color, amount }: { x: number; y: number; text: string; color: string; amount: number }) => {
  return (
    <View style={[styles.labelContainer, { left: x, top: y }]}>
      <View style={[styles.labelBox, { backgroundColor: color }]}>
        <Typo size={12} color={colors.white} style={styles.labelText}>
          {text}
        </Typo>
        <Typo size={10} color={colors.white} style={styles.amountText}>
          KES {formatNumber(amount)}
        </Typo>
      </View>
    </View>
  );
};

const graphs = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(false);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
  };

  const fetchCategoryExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get start and end of selected month
      const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

      // Query transactions for the selected month
      const transactionsRef = collection(firestore, "transactions");
      const q = query(
        transactionsRef,
        where("uid", "==", user?.uid),
        where("type", "==", "expense"),
        where("category", "!=", "transfers"),
        where("date", ">=", Timestamp.fromDate(startDate)),
        where("date", "<=", Timestamp.fromDate(endDate))
      );

      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as TransactionType))
        .filter(transaction => transaction.category !== "transfers");

      // Calculate expenses by category
      const categoryTotals: { [key: string]: number } = {};
      let total = 0;

      transactions.forEach(transaction => {
        if (transaction.category) {
          categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
          total += transaction.amount;
        }
      });

      // Convert to pie chart data format
      const pieData = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1]) // Sort by amount in descending order
        .map(([category, amount]) => {
          const percentage = (amount / total) * 100;
          return {
            value: amount,
            text: percentage >= 5 ? `${percentage.toFixed(1)}%` : '', // Only show percentage for segments >= 5%
            color: expenseCategories[category]?.bgColor || colors.neutral500,
            label: expenseCategories[category]?.label || "Others",
            amount: amount,
            percentage: percentage,
            focused: true,
            textColor: colors.white,
            textSize: 14,
            fontWeight: '600',
            shiftTextX: 0,
            shiftTextY: -scale(25)
          };
        });

      setCategoryData(pieData);
      setTotalExpenses(total);
    } catch (error) {
      console.error("Error fetching category expenses:", error);
      setError("Failed to load expense data. Please try again.");
      Alert.alert(
        "Connection Error",
        "Unable to connect to the server. Please check your internet connection and try again.",
        [
          {
            text: "Retry",
            onPress: () => fetchCategoryExpenses()
          },
          {
            text: "OK",
            style: "cancel"
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryExpenses();
  }, [selectedMonth]);

  const renderCenterLabel = () => (
    <TouchableOpacity 
      style={styles.centerLabel}
      onPress={() => setShowBalance(!showBalance)}
    >
      <Typo size={16} color={colors.neutral400}>
        Total
      </Typo>
      <View style={styles.balanceContainer}>
        <Typo size={24} fontWeight="500">
          KES {formatNumber(totalExpenses)}
        </Typo>
        {!showBalance && (
          <BlurView
            intensity={50}
            tint="dark"
            style={styles.blurView}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Typo size={24} fontWeight="500">
            Category Expenses
          </Typo>
        </View>

        <View style={styles.monthNavigator}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateMonth('prev')}
          >
            <Icons.CaretLeft
              size={verticalScale(24)}
              color={colors.white}
              weight="bold"
            />
          </TouchableOpacity>
          <Typo size={16} style={styles.monthText}>
            {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Typo>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth('next')}
          >
            <Icons.CaretRight
              size={verticalScale(24)}
              color={colors.white}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <Loading />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Typo size={16} color={colors.neutral400}>
              {error}
            </Typo>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchCategoryExpenses}
            >
              <Typo size={14} color={colors.white}>
                Retry
              </Typo>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.chartContainer}>
              {categoryData.length > 0 ? (
                <View style={styles.chartBackground}>
                  <PieChart
                    data={categoryData}
                    donut
                    showText
                    textColor="white"
                    radius={scale(120)}
                    innerRadius={scale(80)}
                    textSize={14}
                    fontWeight="600"
                    showValuesAsLabels={false}
                    showTextBackground={false}
                    textBackgroundRadius={26}
                    centerLabelComponent={renderCenterLabel}
                    focusOnPress
                    sectionAutoFocus
                    initialAngle={90}
                    innerCircleColor={colors.neutral800}
                    innerCircleBorderWidth={2}
                    innerCircleBorderColor={colors.neutral700}
                  />
                </View>
              ) : (
                <View style={styles.noData}>
                  <Typo size={16} color={colors.neutral400}>
                    No expenses for this month
                  </Typo>
                </View>
              )}
            </View>

            <View style={styles.legendContainer}>
              {categoryData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <View style={styles.legendText}>
                    <Typo size={14}>{item.label}</Typo>
                    <View style={styles.legendAmount}>
                      <Typo size={14} color={colors.neutral400}>
                        KES {formatNumber(item.amount)}
                      </Typo>
                      <Typo size={12} color={colors.neutral500}>
                        ({item.percentage.toFixed(1)}%)
                      </Typo>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default graphs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacingX._20,
  },
  header: {
    marginBottom: spacingY._10,
  },
  monthNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingX._10,
    marginBottom: spacingY._20,
  },
  navButton: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: radius._12,
  },
  monthText: {
    minWidth: scale(120),
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: spacingY._20,
  },
  chartBackground: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._20,
    padding: spacingX._20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noData: {
    height: scale(240),
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    marginTop: spacingY._20,
    gap: spacingY._10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._10,
  },
  legendColor: {
    width: scale(12),
    height: scale(12),
    borderRadius: radius._6,
  },
  legendText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendAmount: {
    alignItems: 'flex-end',
  },
  errorContainer: {
    height: scale(240),
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingY._10,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._10,
    borderRadius: radius._12,
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  labelBox: {
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._5,
    borderRadius: radius._12,
    minWidth: scale(80),
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  labelText: {
    fontWeight: '600',
  },
  amountText: {
    opacity: 0.8,
  },
  balanceContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius._12,
  },
}); 