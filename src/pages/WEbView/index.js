import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import PropType from 'prop-types';

const Webview = ({ url }) => {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{
          uri: url,
        }}
      />
    </View>
  );
};

Webview.propTypes = {
  url: PropType.string.isRequired,
};

export default WebView;
