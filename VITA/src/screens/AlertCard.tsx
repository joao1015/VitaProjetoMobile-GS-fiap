import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Report } from '../services/api';
import { Colors, Spacing, Typography } from '../styles/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  item: Report;
}

const AlertCard: React.FC<Props> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <TouchableWithoutFeedback onPress={toggleExpand}>
      <View style={[styles.card, expanded && styles.cardExpanded]}>
        <Text style={styles.title}>⚠️ {item.type}</Text>
        {expanded && (
          <>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.meta}>
              📍 {item.address || 'Endereço não informado'}{"\n"}
              📅 {new Date(item.date).toLocaleString('pt-BR')}
            </Text>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceAlt,
    padding: Spacing(3),
    borderRadius: 8,
    marginBottom: Spacing(3),
    overflow: 'hidden',
  },
  cardExpanded: {
    padding: Spacing(5),
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.primaryDark,
  },
  desc: {
    ...Typography.body,
    marginTop: Spacing(2),
  },
  meta: {
    ...Typography.caption,
    marginTop: Spacing(2),
    color: Colors.textSecondary,
  },
});

export default AlertCard;