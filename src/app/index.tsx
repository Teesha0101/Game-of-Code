import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QUESTIONS = [
  // FACTOR 1
  { id: 'q1', factor: 1, text: "Frequency of use", options: [{ l: "Never", v: 0 }, { l: "Once or twice", v: 1 }, { l: "Monthly", v: 2 }, { l: "Weekly", v: 3 }, { l: "Daily or almost daily", v: 4 }] },
  { id: 'q2', factor: 1, text: "Amount used per session", options: [{ l: "A small amount", v: 1 }, { l: "A moderate amount", v: 2 }, { l: "A large amount", v: 3 }, { l: "A very large amount", v: 4 }, { l: "I'm not sure", v: 2 }] },
  { id: 'q3', factor: 1, text: "Used more than intended", options: [{ l: "Never", v: 0 }, { l: "Once or twice", v: 1 }, { l: "Monthly", v: 2 }, { l: "Weekly", v: 3 }, { l: "Daily or almost daily", v: 4 }] },
  // FACTOR 2
  { id: 'q4', factor: 2, text: "Strong urges/cravings", options: [{ l: "Never", v: 0 }, { l: "Once or twice", v: 1 }, { l: "Monthly", v: 2 }, { l: "Weekly", v: 3 }, { l: "Daily or almost daily", v: 4 }] },
  { id: 'q5', factor: 2, text: "Tried to cut down but failed", options: [{ l: "No, never", v: 0 }, { l: "Yes, but not in past 3 months", v: 2 }, { l: "Yes, in past 3 months", v: 4 }] },
  { id: 'q6', factor: 2, text: "Took more time/attention than intended", options: [{ l: "Never", v: 0 }, { l: "Once or twice", v: 1 }, { l: "Monthly", v: 2 }, { l: "Weekly", v: 3 }, { l: "Daily or almost daily", v: 4 }] },
  // FACTOR 3
  { id: 'q7', factor: 3, text: "Failed responsibilities", options: [{ l: "Never", v: 0 }, { l: "Once or twice", v: 1 }, { l: "Monthly", v: 2 }, { l: "Weekly", v: 3 }, { l: "Daily or almost daily", v: 4 }] },
  { id: 'q8', factor: 3, text: "Problems caused by use", options: [{ l: "Never", v: 0 }, { l: "Once or twice", v: 1 }, { l: "Monthly", v: 2 }, { l: "Weekly", v: 3 }, { l: "Daily or almost daily", v: 4 }] },
  { id: 'q9', factor: 3, text: "Others expressed concern", options: [{ l: "No, never", v: 0 }, { l: "Yes, but not past 3 months", v: 2 }, { l: "Yes, past 3 months", v: 4 }] },
  // FACTOR 4
  { id: 'q10', factor: 4, text: "Dangerous situation use", options: [{ l: "No", v: 0 }, { l: "Yes, once", v: 3 }, { l: "Yes, more than once", v: 4 }] },
  { id: 'q11', factor: 4, text: "Mixing substances", options: [{ l: "No", v: 0 }, { l: "Yes, once", v: 3 }, { l: "Yes, more than once", v: 4 }, { l: "I'm not sure", v: 2 }] },
  { id: 'q12', factor: 4, text: "Withdrawal symptoms", options: [{ l: "No", v: 0 }, { l: "Yes, mild", v: 2 }, { l: "Yes, moderate", v: 3 }, { l: "Yes, severe", v: 4 }, { l: "I have not tried to reduce/stop", v: 1 }] },
  { id: 'q13', factor: 4, text: "Injection use", options: [{ l: "No, never", v: 0 }, { l: "Yes, but not past 3 months", v: 2 }, { l: "Yes, past 3 months", v: 4 }] },
  { id: 'q14', factor: 4, text: "Overdose / blackout / medical emergency", options: [{ l: "No", v: 0 }, { l: "Yes, once", v: 4 }, { l: "Yes, more than once", v: 4 }, { l: "I'm not sure", v: 2 }] },
];

type Answer = { [key: string]: number };

const FactorResult = ({ label, score, info }: { label: string; score: number; info: { label: string; color: string } }) => (
  <View style={styles.factorCard}>
    <Text style={styles.factorLabel}>{label}</Text>
    <View style={styles.row}>
      <Text style={[styles.factorScore, { color: info.color }]}>{Math.round(score)}%</Text>
      <Text style={[styles.riskBadge, { backgroundColor: info.color }]}>{info.label}</Text>
    </View>
  </View>
);

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: number) => {
    const updatedAnswers = { ...answers, [QUESTIONS[currentIndex].id]: value };
    setAnswers(updatedAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScores = () => {
    const getVal = (id: string) => answers[id] || 0;

    const f1Raw = getVal('q1') + getVal('q2') + getVal('q3');
    const f2Raw = getVal('q4') + getVal('q5') + getVal('q6');
    const f3Raw = getVal('q7') + getVal('q8') + getVal('q9');
    const f4Raw = getVal('q10') + getVal('q11') + getVal('q12') + getVal('q13') + getVal('q14');

    const f1 = (f1Raw / 12) * 100;
    const f2 = (f2Raw / 12) * 100;
    const f3 = (f3Raw / 12) * 100;
    const f4 = (f4Raw / 20) * 100;

    const overall = (0.2 * f1) + (0.25 * f2) + (0.25 * f3) + (0.3 * f4);

    const isUrgent =
      getVal('q14') >= 4 ||
      getVal('q12') === 4 ||
      (getVal('q13') === 4 && getVal('q1') >= 3) ||
      (getVal('q10') === 4 && getVal('q1') === 4);

    return { f1, f2, f3, f4, overall, isUrgent };
  };

  const getRiskLevel = (score: number) => {
    if (score <= 20) return { label: 'Low', color: '#4CAF50' };
    if (score <= 50) return { label: 'Moderate', color: '#FFC107' };
    if (score <= 75) return { label: 'High', color: '#FF9800' };
    return { label: 'Very High', color: '#F44336' };
  };

  if (showResults) {
    const scores = calculateScores();
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Your Assessment</Text>

          {scores.isUrgent && (
            <View style={styles.urgentCard}>
              <Text style={styles.urgentText}>⚠️ URGENT SUPPORT MODE</Text>
              <Text style={styles.subText}>Please contact a medical professional or crisis helpline immediately. SAMHSA Helpline: 1-800-662-4357 (free, confidential, 24/7)</Text>
            </View>
          )}

          <FactorResult label="Frequency & Intensity" score={scores.f1} info={getRiskLevel(scores.f1)} />
          <FactorResult label="Control & Cravings" score={scores.f2} info={getRiskLevel(scores.f2)} />
          <FactorResult label="Impact on Life" score={scores.f3} info={getRiskLevel(scores.f3)} />
          <FactorResult label="Safety & Dependence" score={scores.f4} info={getRiskLevel(scores.f4)} />

          <View style={styles.overallBox}>
            <Text style={styles.overallLabel}>Overall Risk Score</Text>
            <Text style={[styles.overallScore, { color: getRiskLevel(scores.overall).color }]}>
              {Math.round(scores.overall)}
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => { setAnswers({}); setCurrentIndex(0); setShowResults(false); }}>
            <Text style={styles.buttonText}>Retake Quiz</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQ = QUESTIONS[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }]} />
      </View>
      <View style={styles.quizContent}>
        <Text style={styles.qNumber}>Question {currentIndex + 1} of {QUESTIONS.length}</Text>
        <Text style={styles.questionText}>{currentQ.text}</Text>
        {currentQ.options.map((opt, i) => (
          <TouchableOpacity key={i} style={styles.optionButton} onPress={() => handleAnswer(opt.v)}>
            <Text style={styles.optionText}>{opt.l}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  progressContainer: { height: 8, backgroundColor: '#E0E0E0', width: '100%' },
  progressBar: { height: '100%', backgroundColor: '#2196F3' },
  quizContent: { padding: 30, flex: 1, justifyContent: 'center' },
  qNumber: { color: '#888', marginBottom: 10, fontWeight: '600' },
  questionText: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, color: '#222' },
  optionButton: { backgroundColor: '#FFF', padding: 18, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#DDD', elevation: 2 },
  optionText: { fontSize: 16, color: '#444', textAlign: 'center', fontWeight: '500' },
  factorCard: { backgroundColor: '#FFF', width: '100%', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 3 },
  factorLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  factorScore: { fontSize: 24, fontWeight: 'bold' },
  riskBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  overallBox: { marginVertical: 30, alignItems: 'center' },
  overallLabel: { fontSize: 18, color: '#444' },
  overallScore: { fontSize: 64, fontWeight: 'bold' },
  urgentCard: { backgroundColor: '#FFEBEE', padding: 20, borderRadius: 15, borderLeftWidth: 5, borderLeftColor: '#F44336', marginBottom: 20 },
  urgentText: { color: '#C62828', fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  subText: { color: '#D32F2F', fontSize: 14 },
  button: { backgroundColor: '#2196F3', padding: 18, borderRadius: 12, width: '100%', marginTop: 20 },
  buttonText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});