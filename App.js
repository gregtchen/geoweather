/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

navigator.geolocation = require('@react-native-community/geolocation');

//Replace api key here!
const APP_ID = '';

export default App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>

          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}

          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Geolocation Weather App</Text>
              <Text style={styles.sectionDescription}>
                Click on the button below, then allow the application to get your location.
              </Text>

              <Geoweather />

            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </>
  );
};

class Geoweather extends React.Component {
  state = {
    location: "---",
    city: "_",
    description: "description",
    temperature: 0,
    windspeed: 0,
    isRunning: false,
    id: null
  }

  toggleWeather = () => {
    if(!this.state.isRunning){
      this.setState({isRunning: true});
      this.watchWeather();
      console.log("started");
    } else {
      this.setState({isRunning: false});
      navigator.geolocation.clearWatch(this.state.id);
      console.log("stopped");
    }
  }

  watchWeather = () => {
    this.setState(
      {
        id: navigator.geolocation.watchPosition(
          position => {
            const location = "latitude: " + position.coords.latitude + " longitude: " + position.coords.longitude;
            this.setState({ location });
            this.fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          error => console.log(error),
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        )

      });
  };

  fetchWeather(latitude, longitude) {
    console.log(latitude, longitude);
    fetch('https://api.openweathermap.org/data/2.5/weather?lat='
      + encodeURIComponent(latitude) + '&lon='
      + encodeURIComponent(longitude) + '&units=imperial&appid=' + APP_ID)
      .then(response => response.json())
      .then(
        (result) => {
          //console.log(result);
          this.setState({
            city: result.name,
            description: result.weather.description,
            temperature: result.main.temp,
            windspeed: result.wind.speed
          });
        });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.toggleWeather} style={styles.button}>
          {!this.state.isRunning ? <Text>Start</Text> : <Text>Stop</Text>}
        </TouchableOpacity>


        <Text style={styles.sectionTitle}>Location Data: </Text>
        <Text style={styles.sectionDescription}>{this.state.location}</Text>
        <Text style={styles.sectionTitle}>Weather Data: </Text>
        <Text style={styles.sectionDescription}>City: <Text style={styles.highlight}>{this.state.city}</Text></Text>
        <Text style={styles.sectionDescription}>Temperature: <Text style={styles.highlight}>{this.state.temperature}°</Text> F</Text>
        <Text style={styles.sectionDescription}>Wind Speed: <Text style={styles.highlight}>{this.state.windspeed}</Text> MPH</Text>
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "orange",
    padding: 10,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

