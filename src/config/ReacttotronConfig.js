import Reacttotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reacttotron.configure()
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
