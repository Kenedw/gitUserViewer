import React from 'react';
import { WebView } from 'react-native-webview';
import PropType from 'prop-types';

export default function Webview({ navigation }) {
  const url = navigation.getParam('url');
  console.tron.log(navigation);

  return <WebView source={{ uri: url }} style={{ flex: 1 }} />;
}

Webview.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('title'),
});

Webview.propTypes = {
  navigation: PropType.func.isRequired,
};
