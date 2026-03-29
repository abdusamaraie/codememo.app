import React from 'react';
import {
  useFonts,
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Regular': JetBrainsMono_400Regular,
    'JetBrainsMono-Medium':  JetBrainsMono_500Medium,
    'JetBrainsMono-Bold':    JetBrainsMono_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <Text style={styles.heading}>CodeMemo</Text>
          <Text style={styles.mono}>JetBrains Mono loaded ✓</Text>
          <StatusBar style="light" />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heading: {
    color: '#E2E4EC',
    fontSize: 24,
    fontWeight: '700',
  },
  mono: {
    color: '#7C6AF6',
    fontSize: 14,
    fontFamily: 'JetBrainsMono-Regular',
  },
});
