import {ConnectionRepository} from "../services/connections/connection-repository";
import {FileUtils} from "../services/utils/file-utils";
import {State} from "../state/state";

import * as path from "path";
import * as os from "os";

const SCHEMA_VERSION = "1.0";

export class AppInitializer{
    public static bootstrap(): Promise<State> {
        let state: State = {
            config: {
                schemaVersion: SCHEMA_VERSION,
                userHomeDirectory: os.homedir(),
                applicationName: null
            },
            viewStates: {
                dbNavigator: {
                    connections: null
                }
            }
        };
        return FileUtils.readJson(path.join(__dirname,'..','/package.json')).then((packageJson) => {
            state.config.applicationName = packageJson.name;
            return ConnectionRepository.initialize(state.config);
        }).then((connections) => {
            state.viewStates.dbNavigator.connections = connections;
            return state;
        });
    }
}

// let appName = packageJson.name.toLowerCase();
//
// const defaultSettings = {
//     version: packageJson.version,
//     name: packageJson.name,
//     website: 'http://mongotron.io/',
//     repository: packageJson.repository.url,
//     repositoryName: 'mongotron',
//     repositoryOwner: 'officert',
//     logLevel: 'debug',
//     buildPath: 'build',
//     releasePath: 'release',
//     appConfigDir: path.join(path.homedir(), `.${appName}`),
//     logFilePath: path.join(path.homedir(), `.${appName}`, 'logs.json'),
//     dbConfigPath: path.join(path.homedir(), `.${appName}`, 'dbConnections.json'),
//     keybindingsPath: path.join(path.homedir(), `.${appName}`, 'keybindings.json'),
//     themesPath: path.join(path.homedir(), `.${appName}`, 'themes.json')
// };
//
// const production = _.extend(_.clone(defaultSettings), {
//     env: 'production'
// });
//
// const development = _.extend(_.clone(defaultSettings), {
//     env: 'development'
// });
//
// const local = _.extend(_.clone(defaultSettings), {
//     env: 'local'
// });
//
// const test = _.extend(_.clone(defaultSettings), {
//     env: 'test',
//     appConfigDir: 'tests/config',
//     logFilePath: 'tests/config/logs.json',
//     dbConfigPath: 'tests/config/dbConnections.json',
//     keybindingsPath: 'tests/config/keybindings.json',
//     themesPath: 'tests/config/themes.json'
// });
//
// const configs = {
//     production: production,
//     development: development,
//     local: local,
//     test: test
// };
//
// function getConfig(env) {
//     let envConfig = configs[env];
//
//     if (!envConfig) throw new Error(`${env} is not a valid environment`);
//
//     console.log('\nENVIRONMENT\n------------------');
//     console.log(envConfig);
//     console.log('\n');
//
//     return envConfig;
// }
//
// /** @exports AppConfig */
// module.exports = getConfig(process.env.NODE_ENV || 'development');
