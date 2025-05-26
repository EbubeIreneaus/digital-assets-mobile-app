import useAppTheme from '@/lib/appTheme';
import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const Services = () => {
  const { textColor } = useAppTheme();

  return (
    <ScrollView className="dark:bg-slate-950 bg-slate-200" contentContainerStyle={styles.container}>
      <Text style={styles.title} className="dark:text-light/50 text-dark/50">Our Services</Text>
      <Text style={styles.subtitle} className="dark:text-light/50 text-dark/50">Updated: May 18, 2025</Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">1. Overview</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        Digital Assets provides a secure and intuitive platform for individuals and organizations looking to grow their wealth through investment in digital financial products. Our services are designed to help users make smart decisions, monitor their portfolios, and achieve long-term financial goals.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">2. Investment Opportunities</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        We offer a variety of investment opportunities, including digital assets such as cryptocurrencies, real estates, stocks and other  financial instruments. Each investment product is carefully selected and monitored to ensure transparency, performance, and potential growth.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">3. Portfolio Management</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        Our platform allows you to create and manage a diverse investment portfolio. You can track your holdings in real-time, review performance analytics, and make informed decisions with the help of our intuitive dashboard and tools.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">4. Security & Compliance</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        We prioritize the security of your data and assets. Our platform uses bank-level encryption, multi-factor authentication, and regular audits to protect your information. We comply with relevant financial regulations and strive to ensure a safe investing experience for all users.
      </Text>

      {/* <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">5. Education & Insights</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        We provide regular market updates, educational resources, and expert insights to keep you informed about the ever-changing investment landscape. Whether you're a beginner or a seasoned investor, we aim to empower you with knowledge.
      </Text> */}

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">6. Customer Support</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        Our support team is available to assist you with inquiries, technical issues, or guidance on how to get the most out of your account. We’re committed to ensuring your experience is seamless and supportive.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">7. Future Services</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        We are continuously evolving. In the near future, we plan to introduce automated investing tools, staking opportunities, peer-to-peer trading, and enhanced financial planning features.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">8. Get Started</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        To begin your journey with Digital Assets, sign up, verify your identity, fund your account, and start exploring our curated investment options. We're here to help you grow — securely, intelligently, and confidently.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 5,
    color: '#333',
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
  },
});

export default Services;
