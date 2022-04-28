import React, {useRef, useMemo, useEffect, useState} from 'react';

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
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  GestureHandlerRootView,
  RectButton,
} from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import memoize from 'memoize-one';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class Calendar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.FirstDay = new Date();
    this.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  }
  state = {
    currentDate: new Date(),
    month: new Date().getMonth(),
  };

  _onPress = item => {
    console.log(this.state.month);
  };

  generateMatrix = memoize((year, month) => {
    var matrix = [];
    var firstDay = new Date(year, month, 1).getDay();
    var maxDays = this.nDays[month];
    if (month == 1) {
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }
    var counter = 1;

    for (var row = 0; row < 7; row++) {
      matrix[row] = [];
      for (var col = 0; col < 7; col++) {
        matrix[row][col] = -1;
        if (row == 0 && col >= firstDay) {
          matrix[row][col] = counter++;
        } else if (row > 0 && counter <= maxDays) {
          matrix[row][col] = counter++;
        }
      }
    }

    return matrix;
  });

  onPressDay(day) {
    const newmarkDates = {...this.props.markDays};
    if (
      `${this.props.year}-${this.props.month}-${day}` in this.props.markDays
    ) {
      delete newmarkDates[`${this.props.year}-${this.props.month}-${day}`];
    } else {
      newmarkDates[`${this.props.year}-${this.props.month}-${day}`] = day;
    }
    this.props.setDays(newmarkDates);
  }

  render() {
    console.log('geerate calendar');
    const matrix = this.generateMatrix(this.props.year, this.props.month);

    const rows = matrix.map((row, rowIndex) => {
      var rowItems = row.map((w, colIndex) => {
        if (w === -1) {
          return <View style={{flex: 1}} key={`${rowIndex}-${colIndex}`} />;
        }
        return (
          <View
            key={`${rowIndex}-${colIndex}`}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this.onPressDay(w)}
              style={{
                height: hp(6),
                width: hp(6),
                borderRadius: hp(6),
                backgroundColor:
                  `${this.props.year}-${this.props.month}-${w}` in
                  this.props.markDays
                    ? 'red'
                    : '#E6E6E6',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontFamily: 'NoirPro-Medium',
                  fontSize: hp(2.3),
                  fontWeight: 'bold',
                }}>
                {w}
              </Text>
            </TouchableOpacity>
          </View>
        );
      });
      return (
        <View
          key={`${rowIndex}`}
          style={{
            marginTop: hp(1.5),
            flex: 1,
            flexDirection: 'row',
            padding: 2,
            paddingTop: hp(4.5),
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          {rowItems}
        </View>
      );
    });

    return <View>{rows}</View>;
  }
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
/////////////////  ///////////////   \//////////////  //////////////////////
/////////////////  //////////////     \/////////////  //////////////////////
/////////////////  /////////////  /|\  \////////////  //////////////////////
/////////////////  ////////////  ///\\  \///////////  //////////////////////
/////////////////  ///////////  //////\  \//////////  //////////////////////
/////////////////  //////////  ///////\\  \/////////  //////////////////////
/////////////////  /////////  /////////\\  \////////  //////////////////////
/////////////////  ////////  ///////////\\  \///////  //////////////////////
/////////////////  ///////  /////////////\\  \//////  //////////////////////
/////////////////  //////  ///////////////\\  \/////  //////////////////////
/////////////////  /////  /////////////////\\  \////  //////////////////////
/////////////////  ////  ///////////////////\\  \///  //////////////////////
/////////////////  ///  /////////////////////\\  \//  //////////////////////
/////////////////  //  ///////////////////////\\  \/  //////////////////////
/////////////////  /  //////////////////////////\  \  //////////////////////
/////////////////    ////////////////////////////\    //////////////////////
/////////////////  ///////////////////////////////\   //////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

class WeekCalendar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.FirstDay = new Date();
    this.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.scrollRef = React.createRef();
    this.Listmonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  }
  state = {
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };

  _onPress = item => {
    const newmarkDates = {...this.props.markDays};
    if (`${item.year}-${item.month}-${item.day}` in this.props.markDays) {
      delete newmarkDates[`${item.year}-${item.month}-${item.day}`];
    } else {
      newmarkDates[`${item.year}-${item.month}-${item.day}`] = item.day;
    }
    this.props.setDays(newmarkDates);
    console.log(newmarkDates);
  };

  generateSnapPoinst = memoize(() => {
    console.log('snap Poinst');
    const space = wp(15);
    const list = [];

    var data = this.nDays.map((a, i) => {
      return a * space;
    });
    var max = 0;
    for (let i = 0; i < data.length; i++) {
      max = data[i] + max;
      list[i] = max;
    }
    return list;
  });

  scrollig(event, startPoint, SnapPoints) {
    if (
      startPoint + event.nativeEvent.contentOffset.x >
      SnapPoints[this.state.month]
    ) {
      this.setState({month: this.state.month + 1});
    } else if (
      startPoint + event.nativeEvent.contentOffset.x <
      SnapPoints[this.state.month - 1]
    ) {
      this.setState({month: this.state.month - 1});
    }
  }

  render() {
    const SnapPoints = this.generateSnapPoinst();
    console.log('render Pure componet alv compa');
    var rowsWeeks = [];
    rowsWeeks = this.props.matrixWeek.map((day, i) => {
      //console.log('week render');
      return (
        <View style={{flex: 1, width: wp(15)}} key={i}>
          <View style={{flex: 3, height: 100}}>
            <Text
              style={{
                fontFamily: 'NoirPro-medium',
                fontSize: hp(2),
                textAlign: 'center',
              }}>
              {this.weekDays[day.week]}
            </Text>
          </View>
          <View
            style={{
              flex: 8,
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this._onPress(day)}
              style={{
                height: hp(6),
                alignSelf: 'center',
                width: hp(6),
                borderRadius: hp(6),
                backgroundColor:
                  `${day.year}-${day.month}-${day.day}` in this.props.markDays
                    ? 'red'
                    : '#E6E6E6',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontFamily: 'NoirPro-Medium',
                  fontSize: hp(2.3),
                  fontWeight: 'bold',
                }}>
                {day.day}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });

    return (
      <View style={{flex: 1, backgroundColor: '#F3F3F3', width: '100%'}}>
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            height: hp(7),
            alignItems: 'center',
            width: '100%',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'NoirPro-Regular',
              fontSize: hp(2.2),
            }}>
            {`${this.Listmonths[this.state.month]} ${this.state.year}`}
          </Text>
        </View>

        {/*WEEK VIEW */}
        <View
          style={{
            width: '100%',
            height: hp(13),
          }}>
          <ScrollView
            ref={this.scrollRef}
            onScroll={event => {
              this.scrollig(
                event,
                this.props.startPoint,
                this.props.SnapPoints,
              );
            }}
            horizontal={true}
            style={{flex: 1, backgroundColor: '#F3F3F3'}}>
            {rowsWeeks}
          </ScrollView>
        </View>
      </View>
    );
  }
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
///////////////////////////// ////////////////////////////////////////////
//////////////////////////  ///  /////////////////////////////////////////
////////////////////////  //////  ////////////////////////////////////////
//////////////////////  /////////  ///////////////////////////////////////
/////////////////////  ///////////  //////////////////////////////////////
////////////////////  ////////////  //////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////                  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
///////////////////  //////////////  /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

const AnimatedTest = ({y2}) => {
  //

  //

  ///

  //////

  /////////

  /////////////////

  /////////////////////////

  ///////////////////////////////

  //////////////////////////////////

  //////////////////////////////////////

  /////////////////////////////////////////////

  ////////////////////////////////////////////////////

  //////////////// Variables and State //////////////////////////
  const HeightCalendar = hp(48);
  const Cursor = hp(5);
  const x = useSharedValue(0);
  const y = useSharedValue(-HeightCalendar * 0.6);
  const y1 = useSharedValue(-HeightCalendar * 0.6);
  const y3 = useSharedValue(100);
  const pointer = useSharedValue(-HeightCalendar * 0.6);

  const [state, setState] = useState(false);

  const [markDays, setDays] = useState({});

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const changeState = () => {
    setState(!state);
  };

  const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const [activeDate, setActiveDate] = useState(new Date());

  const renderWeekdays = weekDays.map((day, INDEX) => {
    return (
      <View style={{flex: 1}} key={`${INDEX}`}>
        <Text style={{textAlign: 'center'}}>{day}</Text>
      </View>
    );
  });

  ////////////////////////////////////////////////////

  /////////////////////////////////////////////

  //////////////////////////////////////

  //////////////////////////////////

  ///////////////////////////////

  /////////////////////////

  /////////////////

  /////////

  //////

  ///

  //

  //

  ///

  //////

  /////////

  /////////////////

  /////////////////////////

  ///////////////////////////////

  //////////////////////////////////

  //////////////////////////////////////

  /////////////////////////////////////////////

  ////////////////////////////////////////////////////

  /////////////////////Generate Every Month Matix ////////////////

  function generateMatrix() {
    var matrix = [];

    var year = activeDate.getFullYear();
    var month = activeDate.getMonth();
    var firstDay = new Date(year, month, 1).getDay();

    var maxDays = nDays[month];
    if (month == 1) {
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }
    var counter = 1;

    for (var row = 0; row < 7; row++) {
      matrix[row] = [];
      for (var col = 0; col < 7; col++) {
        matrix[row][col] = -1;
        if (row == 0 && col >= firstDay) {
          matrix[row][col] = counter++;
        } else if (row > 0 && counter <= maxDays) {
          matrix[row][col] = counter++;
        }
      }
    }

    return matrix;
  }

  var matrix = useMemo(generateMatrix, [activeDate]);

  ////////////////////////////////////////////////////

  /////////////////////////////////////////////

  //////////////////////////////////////

  //////////////////////////////////

  ///////////////////////////////

  /////////////////////////

  /////////////////

  /////////

  //////

  ///

  //

  //

  //

  ///

  //////

  /////////

  /////////////////

  /////////////////////////

  ///////////////////////////////

  //////////////////////////////////

  //////////////////////////////////////

  /////////////////////////////////////////////

  ////////////////////////////////////////////////////

  ////////////////Matrix to Generate Weeek Calendar //////////////////////////

  const generateWeek = () => {
    console.log('generate wekkkkk');
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var actualDate = new Date().getDate();
    console.log('generating', month);
    var list = [];
    var count = actualDate;
    list.push({
      day: count,
      week: new Date(year, month, count).getDay(),
      month: month,
      year: year,
    });

    //Variable to determinate how many days Render will generate

    for (var i = 0; i < 100; i++) {
      if (count >= nDays[month]) {
        count = 1;
        month = month + 1;
        list.push({
          day: count,
          week: new Date(year, month, count).getDay(),
          month: month,
          year: year,
        });
      } else {
        list.push({
          day: count + 1,
          week: new Date(year, month, count + 1).getDay(),
          month: month,
          year: year,
        });
      }
      count = count + 1;
    }
    return list;
  };

  const matrixWeek = useMemo(generateWeek, [HeightCalendar]);

  const generateSnapPoinst = () => {
    console.log('snap Poinst');
    const space = wp(15);
    const list = [];

    var data = nDays.map((a, i) => {
      return a * space;
    });
    var max = 0;
    for (let i = 0; i < data.length; i++) {
      max = data[i] + max;
      list[i] = max;
    }
    return list;
  };

  const SnapPoints = useMemo(generateSnapPoinst, [HeightCalendar]);

  const getStartPosition = () => {
    const space = wp(15);
    const month = new Date().getMonth();
    const day = new Date().getDay();
    console.log(SnapPoints[month] + day * space);
    return SnapPoints[month] + day * space;
  };

  const startPoint = useMemo(getStartPosition, [HeightCalendar]);

  ////////////////////////////////////////////////////

  /////////////////////////////////////////////

  //////////////////////////////////////

  //////////////////////////////////

  ///////////////////////////////

  /////////////////////////

  /////////////////

  /////////

  //////

  ///

  //

  //

  ///

  //////

  /////////

  /////////////////

  /////////////////////////

  ///////////////////////////////

  //////////////////////////////////

  //////////////////////////////////////

  /////////////////////////////////////////////

  ////////////////////////////////////////////////////

  /////////////////////Manage Animation Functions //////////

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
      ctx.height = y2.value;
    },
    onActive: (event, ctx) => {
      y1.value =
        ctx.startY + event.translationY > 0
          ? 0
          : ctx.startY + event.translationY < -HeightCalendar * 0.6
          ? -HeightCalendar * 0.6
          : ctx.startY + event.translationY;
      y.value =
        ctx.startY + event.translationY > 0
          ? 0
          : ctx.startY + event.translationY < -HeightCalendar * 0.6
          ? -HeightCalendar * 0.6
          : ctx.startY + event.translationY;
      y2.value = ctx.height + event.translationY;
    },
    onEnd: () => {
      if (
        y.value > -HeightCalendar * 0.6 &&
        pointer.value === -HeightCalendar * 0.6
      ) {
        y.value = withSpring(0, {
          damping: 100,
          mass: 1,
          stiffness: 100,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
        });
        y1.value = withSpring(0, {
          damping: 100,
          mass: 1,
          stiffness: 100,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
        });
        y2.value = withSpring(180, {
          damping: 100,
          mass: 1,
          stiffness: 100,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
        });
        pointer.value = 0;
      } else if (y.value < 0 && pointer.value === 0) {
        y.value = withSpring(-HeightCalendar * 0.6, {
          damping: 100,
          mass: 1,
          stiffness: 100,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
        });
        y1.value = withSpring(-HeightCalendar * 0.6, {
          damping: 100,
          mass: 1,
          stiffness: 100,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
        });
        y2.value = withSpring(0, {
          damping: 100,
          mass: 1,
          stiffness: 100,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
        });
        pointer.value = -HeightCalendar * 0.6;
        //setState(false)
      }
      runOnJS(changeState)();
      console.log(y.value);
    },
  });

  useEffect(() => {
    /* if (state) {
      scroll.current.scrollTo({y: hp(53)});
    } else {
      scroll.current.scrollTo({y: 0});
    } */
  }, [state]);

  const animatedStyle = useAnimatedStyle(() => {
    return {transform: [{translateY: y.value}]};
  });

  const animatedStyle1 = useAnimatedStyle(() => {
    return {transform: [{translateY: y1.value}]};
  });
  const animatedStyle2 = useAnimatedStyle(() => {
    return {transform: [{translateY: y.value}]};
  });
  /////////////////////////////////////////////////

  /////////////////////////////////////////////////

  //////////////////////////////////////////

  ////////////////////////////////////

  ///////////////////////////////////

  ///////////////////////////////

  //////////////////////////

  /////////////////////

  ///////////////

  ////////

  /////

  ///

  //

  //

  ///

  //////

  /////////

  /////////////////

  /////////////////////////

  ///////////////////////////////

  //////////////////////////////////

  //////////////////////////////////////

  /////////////////////////////////////////////

  ////////////////////////////////////////////////////

  /////////////////////COntrol the INteractions ////////

  _onPress = item => {
    const newmarkDates = {...markDays};
    const month = activeDate.getMonth();
    const year = activeDate.getFullYear();
    if (`${year}-${month}-${item}` in markDays) {
      delete newmarkDates[`${year}-${month}-${item}`];
    } else {
      newmarkDates[`${year}-${month}-${item}`] = item;
    }
    setDays(newmarkDates);
    console.log(newmarkDates);
  };

  function onSwipeLeft(gestureState) {
    setActiveDate(() => {
      const date = new Date(activeDate);
      date.setMonth(activeDate.getMonth() + 1);
      return date;
    });
  }

  function onSwipeRight(gestureState) {
    setActiveDate(() => {
      const date = new Date(activeDate);
      date.setMonth(activeDate.getMonth() - 1);
      return date;
    });
  }

  return (
    <View style={{flex: 1, width: '100%'}}>
      <GestureHandlerRootView style={{flex: 1, width: '100%'}}>
        <Animated.View
          style={[
            {height: HeightCalendar, width: '100%', backgroundColor: 'green'},
            animatedStyle1,
          ]}>
          <View
            style={{height: hp(53), width: '100%', backgroundColor: 'pink'}}>
            <Animated.View
              style={[
                {
                  height: HeightCalendar,
                  width: '100%',
                  backgroundColor: '#F3F3F3',
                },
                animatedStyle1,
              ]}>
              <GestureRecognizer
                onSwipeLeft={() => onSwipeLeft()}
                onSwipeRight={() => onSwipeRight()}>
                <View
                  style={{
                    height: hp(48),
                    backgroundColor: '#F3F3F3',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: hp(5),
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'NoirPro-Regular',
                        fontSize: hp(2.2),
                      }}>
                      {months[activeDate.getMonth()]} {activeDate.getFullYear()}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>{renderWeekdays}</View>
                  <View style={{flex: 1, width: '100%'}}>
                    <Calendar
                      year={activeDate.getFullYear()}
                      month={activeDate.getMonth()}
                      markDays={markDays}
                      setDays={setDays}
                    />
                  </View>
                </View>
              </GestureRecognizer>
            </Animated.View>

            <Animated.View
              style={[
                {
                  height: hp(29),
                  width: '100%',
                  backgroundColor: '#F3F3F3',
                  justifyContent: 'flex-end',
                },
                animatedStyle1,
              ]}>
              <View
                style={{
                  height: hp(20),
                  width: '100%',
                  backgroundColor: '#F3F3F3',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <WeekCalendar
                  matrixWeek={matrixWeek}
                  markDays={markDays}
                  setDays={setDays}
                  startPoint={startPoint}
                  SnapPoints={SnapPoints}
                />
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              {
                height: Cursor,
                width: '100%',
                backgroundColor: 'red',
                zIndex: 10,
              },
              animatedStyle,
            ]}
          />
        </PanGestureHandler>

        <Animated.View
          style={[
            {
              height: hp(72),
              width: '100%',
              backgroundColor: 'white',
            },
            animatedStyle2,
          ]}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              style={{
                height: hp(10),
                width: hp(10),
                backgroundColor: 'yellow',
              }}>
              <Text>TouchableOpacity</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </View>
  );
};

class Test extends React.PureComponent {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  state = {
    day: '2023-01-23',
  };

  render() {
    return (
      <View style={{backgroundColor: 'blue', flex: 1}}>
        <AnimatedTest y2={this.props.y2} />
      </View>
    );
  }
}

export default Test;

{
  /*     <ScrollView
            ref={scroll}
            scrollEnabled={false}
            style={{height: hp(53), width: '100%'}}>
            <View style={{height: hp(29), backgroundColor: 'red'}}></View>
            <View
              style={{
                height: hp(20),
                width: '100%',
                backgroundColor: '#F3F3F3',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <WeekCalendar
                matrixWeek={matrixWeek}
                markDays={markDays}
                setDays={setDays}
              />
            </View>
            <GestureRecognizer
              onSwipeLeft={() => onSwipeLeft()}
              onSwipeRight={() => onSwipeRight()}>
              <View
                style={{
                  height: hp(48),
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: hp(5),
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'NoirPro-Regular',
                      fontSize: hp(2.2),
                    }}>
                    {months[activeDate.getMonth()]} {activeDate.getFullYear()}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>{renderWeekdays}</View>
                <View style={{flex: 1, width: '100%'}}>
                  <Calendar
                    year={activeDate.getFullYear()}
                    month={activeDate.getMonth()}
                    markDays={markDays}
                    setDays={setDays}
                  />
                </View>
              </View>
            </GestureRecognizer>
          </ScrollView> */
}
