/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Calendar from './calendar';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const y2 = useSharedValue(0);
  const y1 = useSharedValue(1);

 	const animatedHandleStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{translateY: y1.value}],
      height: y2.value,
    };
  });

  const backgroundStyle = {
    backgroundColor: 'red',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={{flex: 1}}>
        <View style={{backgroundColor: 'white', height: hp(10), zIndex: 10}}>
          <Text>cursor</Text>

          <Animated.View
            style={[
              {
                width: '100%',
                backgroundColor: '#F3F3F3',

                bottom: 0,
                position: 'absolute',
              },
              animatedHandleStyle2,
            ]}></Animated.View>
        </View>

        <Calendar y2={y2} numberofMonths={5} numberOfDays={100}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                console.log(_.isEqual({}, {}));
              }}
              style={{
                height: hp(10),
                width: hp(10),
                backgroundColor: 'yellow',
              }}>
              <Text>TouchableOpacity</Text>
            </TouchableOpacity>
            <Text>working</Text>
          </View>
        </Calendar>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
