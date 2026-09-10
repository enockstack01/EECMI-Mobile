import { Component, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { Brand } from '@/constants/theme';

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * Catches render-time crashes anywhere in the tree so a standalone build shows a
 * readable message instead of silently closing. Also force-hides the splash
 * screen, which otherwise stays up and looks like the app "won't open".
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch() {
    SplashScreen.hideAsync().catch(() => {});
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.subtitle}>
          The app hit an error while starting. Please share this screen with the EECMI team.
        </Text>
        <ScrollView style={styles.box} contentContainerStyle={styles.boxContent}>
          <Text style={styles.mono}>{error.name}: {error.message}</Text>
          {error.stack ? <Text style={styles.monoDim}>{error.stack}</Text> : null}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.forestDark,
    padding: 24,
    justifyContent: 'center',
  },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  box: {
    maxHeight: 320,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,160,23,0.4)',
  },
  boxContent: { padding: 14 },
  mono: { color: Brand.goldLight, fontFamily: 'monospace', fontSize: 12, marginBottom: 10 },
  monoDim: { color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', fontSize: 11, lineHeight: 16 },
});
