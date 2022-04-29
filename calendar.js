import React, {useMemo, useEffect, useState} from 'react';

import {ScrollView, Text, View, TouchableOpacity, FlatList} from 'react-native';
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
} from 'react-native-gesture-handler';
import _ from 'lodash';

import memoize from 'memoize-one';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
/////////////////                                     //////////////////////
/////////////////  ///////////////////////////////// //////////////////////
/////////////////  //////////////////////////////// ////////////////////////
/////////////////  /////////////////////////////////////////////////////////
/////////////////  /////////////////////////////////////////////////////////
/////////////////  /////////////////////////////////////////////////////////
/////////////////  /////////////////////////////////////////////////////////
/////////////////  /////////////////////////////////////////////////////////
/////////////////  /////////////////////////////////////////////////////////
/////////////////  /////////////////////////////////////////////////////////
/////////////////  /////////////////////////////////////////////////////////
/////////////////  /////////////////////////////////////////////////////////
/////////////////  /////////////////////////////////////////////////////////
/////////////////  /////////////////////////////////////////////////////////
/////////////////  /////////////////////////////////////////////////////////
/////////////////   ////////////////////////////////////////////////////////
/////////////////                                  /////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

class Calendar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.FirstDay = new Date();
    this.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.months = [
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

    this.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

  onPressDay2(day) {
    this.props.setAcualDay({
      year: this.props.year,
      month: this.props.month,
      day: day,
    });
  }

  render() {
    console.log('geerate calendar', this.props.month);
    const matrix = this.generateMatrix(this.props.year, this.props.month);

    const renderWeekdays = this.weekDays.map((day, INDEX) => {
      return (
        <View style={{flex: 1}} key={`${INDEX}`}>
          <Text style={{textAlign: 'center'}}>{day}</Text>
        </View>
      );
    });

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
              onPress={() => this.onPressDay2(w)}
              style={{
                height: hp(6),
                width: hp(6),
                borderRadius: hp(6),
                backgroundColor:
                  this.props.actualDay.year === this.props.year &&
                  this.props.actualDay.month === this.props.month &&
                  this.props.actualDay.day === w
                    ? 'green'
                    : `${this.props.year}-${this.props.month}-${w}` in
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

    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            height: hp(5),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'NoirPro-Regular',
              fontSize: hp(2.2),
            }}>
            {this.months[this.props.month]} {this.props.year}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>{renderWeekdays}</View>
        {rows}
      </View>
    );
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
    year: new Date().getFullYear(),
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

  _onPress2 = item => {
    this.props.setAcualDay({
      year: item.year,
      month: item.month,
      day: item.day,
    });
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
              onPress={() => this._onPress2(day)}
              style={{
                height: hp(6),
                alignSelf: 'center',
                width: hp(6),
                borderRadius: hp(6),
                backgroundColor:
                  this.props.actualDay.year === day.year &&
                  this.props.actualDay.month === day.month &&
                  this.props.actualDay.day === day.day
                    ? 'green'
                    : `${day.year}-${day.month}-${day.day}` in
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
////////////////////////////  ////////////////////////////////////////////
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

const CalendarAimated = ({y2, children, numberOfDays, numberofMonths}) => {
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
  const pointer = useSharedValue(-HeightCalendar * 0.6);
  const [markDays, setDays] = useState({});

  const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const [actualDay, setAcualDay] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
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

    for (var i = 0; i < numberOfDays; i++) {
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
    },
  });

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

  const generateCalendarsList = () => {
    var m_y = new Date();
    var date = new Date(m_y.getFullYear(), m_y.getMonth(), 1);
    var list = [];
    for (let i = 0; i < numberofMonths; i++) {
      list.push({year: date.getFullYear(), month: date.getMonth()});
      date.setMonth(date.getMonth() + 1);
    }
    return list;
  };

  const testingListCalendar = useMemo(generateCalendarsList, [HeightCalendar]);

  const hook = useMemo(() => {
    return {year: 3000, month: 13, day: 0};
  }, [HeightCalendar]);

  const renderItem = ({item, index}) => {
    return (
      <View style={{flex: 1, width: wp(100)}} key={index}>
        <Calendar
          year={item.year}
          month={item.month}
          markDays={markDays}
          setDays={setDays}
          isCurrentDay={
            item.year === actualDay.year && item.month === actualDay.month
              ? true
              : false
          }
          actualDay={
            item.year === actualDay.year && item.month === actualDay.month
              ? actualDay
              : hook
          }
          setAcualDay={setAcualDay}
        />
      </View>
    );
  };

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
              <View
                style={{
                  height: hp(48),
                  backgroundColor: '#F3F3F3',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <View style={{flex: 1, width: '100%'}}>
                  <FlatList
                    data={testingListCalendar}
                    renderItem={renderItem}
                    initialNumToRender={6}
                    keyExtractor={item => {
                      `${item.month}-${item.year}`;
                    }}
                    horizontal={true}
                    snapToAlignment="start"
                    decelerationRate={'fast'}
                    snapToInterval={wp(100)}
                  />
                </View>
              </View>
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
                  actualDay={actualDay}
                  setAcualDay={setAcualDay}
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
          {children}
        </Animated.View>
      </GestureHandlerRootView>
    </View>
  );
};

class CalendarComponet extends React.PureComponent {
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
        <CalendarAimated
          y2={this.props.y2}
          numberOfDays={this.props.numberOfDays}
          numberofMonths={this.props.numberofMonths}>
          {this.props.children}
        </CalendarAimated>
      </View>
    );
  }
}

export default CalendarComponet;
