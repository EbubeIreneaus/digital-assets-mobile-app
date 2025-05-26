import useAppTheme from '@/lib/appTheme';
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const PrivacyPolicy = () => {
  const { textColor } = useAppTheme();

  return (
    <ScrollView className="dark:bg-slate-950 bg-slate-200" contentContainerStyle={styles.container}>
      <Text style={styles.title} className="dark:text-light/50 text-dark/50">Privacy Policy</Text>
      <Text style={styles.subtitle} className="dark:text-light/50 text-dark/50">Last updated: May 18, 2025</Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">1. Introduction</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        At Digital Assets, your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using our services, you consent to the practices outlined in this policy.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">2. Information We Collect</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        We may collect personal information such as your name, email address, phone number, financial data, and usage details. This helps us provide better service, communicate with you, and ensure a safe experience.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">3. How We Use Your Information</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        We use your information to create and manage your account, process transactions, send updates, improve our services, and protect against fraud and unauthorized activity.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">4. Sharing Your Information</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        We do not sell your personal information. We may share it with trusted third parties to perform essential services such as payment processing, analytics, or legal compliance. All partners must uphold data protection standards.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">5. Data Security</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        We implement strong security measures to protect your data from unauthorized access, disclosure, or loss. However, no system is 100% secure, and we advise you to take precautions such as keeping your login details confidential.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">6. Cookies and Tracking</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        We may use cookies or similar tracking technologies to analyze user behavior and enhance your experience. You can manage your cookie preferences in your app settings.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">7. Your Rights</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        You have the right to access, correct, or delete your personal information. You may also opt out of promotional communications at any time by contacting us or using the unsubscribe link provided.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">8. Children's Privacy</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        Our services are not intended for children under 18. We do not knowingly collect personal data from minors. If we learn we’ve collected data from a child, we will delete it immediately.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">9. Changes to This Policy</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        We may update this Privacy Policy from time to time. When we do, we’ll revise the “Last updated” date. Continued use of our services after changes means you agree to the revised policy.
      </Text>

      <Text style={styles.sectionTitle} className="dark:text-light/80 text-dark/80">10. Contact Us</Text>
      <Text style={styles.text} className="dark:text-light text-dark">
        If you have any questions or concerns about this Privacy Policy, please contact us at support@ireneausglobals.com.
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

export default PrivacyPolicy;
