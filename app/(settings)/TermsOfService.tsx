import useAppTheme from '@/lib/appTheme';
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const TermsOfService = () => {
    const {textColor} = useAppTheme()
  return (
    <ScrollView className='dark:bg-slate-950 bg-slate-200' contentContainerStyle={styles.container}>
      <Text style={styles.title} className='dark:text-light/50 text-dark/50'>Terms of Service</Text>
      <Text style={styles.subtitle} className='dark:text-light/50 text-dark/50'>Last updated: May 18, 2025</Text>

      <Text style={styles.sectionTitle} className='dark:text-light/80 text-dark/80'>1. Introduction</Text>
      <Text className='dark:text-light text-dark' style={styles.text}>
        Welcome to Digital Assets. These Terms of Service ("Terms") govern your use of our investment platform and services. By accessing or using our services, you agree to be bound by these Terms.
      </Text>

      <Text style={styles.sectionTitle} className='dark:text-light/80 text-dark/80'>2. Eligibility</Text>
      <Text style={styles.text} className='dark:text-light text-dark'>
        You must be at least 18 years old and capable of entering into a binding contract in order to use our services. By using our services, you represent and warrant that you meet these eligibility requirements.
      </Text>

      <Text style={styles.sectionTitle} className='dark:text-light/80 text-dark/80'>3. Investment Disclaimer</Text>
      <Text style={styles.text} className='dark:text-light text-dark'>
        Investments involve risk, including the possible loss of capital. Digital Assets does not guarantee any returns on investment. You are solely responsible for your investment decisions and should consult a financial advisor before making any investments.
      </Text>

      <Text style={styles.sectionTitle} className='dark:text-light/80 text-dark/80'>4. User Responsibilities</Text>
      <Text style={styles.text} className='dark:text-light text-dark'>
        You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to misrepresent your identity, engage in fraudulent activity, or violate any applicable laws or regulations.
      </Text>

      <Text style={styles.sectionTitle} className='dark:text-light/80 text-dark/80'>5. Account Security</Text>
      <Text style={styles.text} className='dark:text-light text-dark'>
        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Please notify us immediately of any unauthorized use.
      </Text>

      <Text style={styles.sectionTitle} className='dark:text-light/80 text-dark/80'>6. Intellectual Property</Text>
      <Text style={styles.text} className='dark:text-light text-dark'>
        All content on our platform, including text, graphics, logos, and software, is the property of Digital Assets and is protected by intellectual property laws. You may not reproduce or redistribute any part of our services without permission.
      </Text>

      <Text style={styles.sectionTitle} className='dark:text-light/80 text-dark/80'>7. Termination</Text>
      <Text style={styles.text} className='dark:text-light text-dark'>
        We may suspend or terminate your access to our services at any time, without prior notice, if you violate these Terms or engage in activities that may harm Digital Assets or other users.
      </Text>

      <Text style={styles.sectionTitle} className='dark:text-light/80 text-dark/80'>8. Changes to Terms</Text>
      <Text style={styles.text} className='dark:text-light text-dark'>
        We reserve the right to modify these Terms at any time. We will provide notice of any changes by updating the "Last updated" date. Continued use of the services after changes constitutes acceptance.
      </Text>

      <Text style={styles.sectionTitle} className='dark:text-light/80 text-dark/80'>9. Contact Us</Text>
      <Text style={styles.text} className='dark:text-light text-dark'>
        If you have any questions about these Terms, please contact us at support@ireneausglobals.com.
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

export default TermsOfService;
