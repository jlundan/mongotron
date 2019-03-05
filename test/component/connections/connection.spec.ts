import { expect } from 'chai';
import 'mocha';
import {Connection} from "../../../src/services/connections/connection";

describe('Connection', () => {
    it('should connect successfully on good url', () => {
        return Connection.newConnection("mongodb://localhost:27017").then((client) => {
            return client.close();
        });
    });

    it('should fail on bad url', () => {
        return Connection.newConnection("mongodb://no.such.localhost:27017").then(() => {
        }).catch((e) => {
            expect(e).not.to.be.null;
        });
    });

    it('should perform successful connection test on good url', () => {
        return Connection.testConnection("mongodb://localhost:27017").then((result) => {
            expect(result).to.equal(true);
        });
    });

    it('should perform failed connection test on bad url', () => {
        return Connection.testConnection("mongodb://no.such.localhost:27017").then((result) => {
            expect(result).to.equal(false);
        });
    });

    it('should list databases successfully', () => {
        let _client;
        return Connection.newConnection("mongodb://localhost:27017").then((client) => {
            _client = client;
            return client.getDatabases();
        }).then((databases) => {
            expect(databases).not.to.be.null;
            expect(databases.length).not.to.equal(0);
            return _client.close();
        });
    });

    // it('should list collections successfully', () => {
    //     let _client;
    //     return Connection.newConnection("mongodb://localhost:27017").then((client) => {
    //         _client = client;
    //         return client.getCollections("local");
    //     }).then((collectionNames) => {
    //         expect(collectionNames).not.to.be.null;
    //         expect(collectionNames.length).not.to.equal(0);
    //         return _client.close();
    //     });
    // });
});
