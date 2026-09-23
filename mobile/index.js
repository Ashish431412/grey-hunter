import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/app/App';
import { name as appName } from './app.json';

// Setup background handlers or global error boundaries here if needed

AppRegistry.registerComponent(appName, () => App);
