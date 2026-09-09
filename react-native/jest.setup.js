jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const mock = require('react-native-safe-area-context/jest/mock');

  return {
    ...(mock.default ?? mock),
    SafeAreaView: ({ children, ...props }) =>
      React.createElement(View, props, children),
  };
});
