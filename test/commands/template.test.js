const { expect, test } = require('@oclif/test');

const fs = require('fs-extra');

describe('template command', () => {
    const config = {
        configPaths: ['./filebeat/filebeat.yml', './heartbeat/heartbeat.yml'],
        configs: {
            credcli: { logPath: 'C:/Users/akhil/.credcli/logs/patch/*.log' },
            nginx: {
                host: 'http://0.0.0.0',
                port: '80'
            },
            rabbitmq: {
                host: 'http://localhost',
                port: '15672'
            }
        }
    };
    const filebeatTemplate = `filebeat.inputs:
    - type: log
      enabled: true
      paths:
          - {{&configs.credcli.logPath}}
`;
    const filebeatData = `filebeat.inputs:
    - type: log
      enabled: true
      paths:
          - C:/Users/akhil/.credcli/logs/patch/*.log
`;
    const heartbeatData = `heartbeat.monitors:
  - type: http
    id: my-monitor
    name: nginx
    urls: ["http://0.0.0.0:80"]
  - type: http
    schedule: "@every 5s"
    urls: ["http://localhost:15672"]
    service_name: rabbitMQ
    id: my-http-service
    name: My HTTP Service`;

    const heartbeatTemplate = `heartbeat.monitors:
  - type: http
    id: my-monitor
    name: nginx
    urls: ["{{&configs.nginx.host}}:{{configs.nginx.port}}"]
  - type: http
    schedule: "@every 5s"
    urls: ["{{&configs.rabbitmq.host}}:{{configs.rabbitmq.port}}"]
    service_name: rabbitMQ
    id: my-http-service
    name: My HTTP Service`;

    before(async () => {
        await fs.mkdir('./filebeat');
        await fs.mkdir('./heartbeat');
        await fs.writeFile(`./templateConfig.json`, JSON.stringify(config, null, 2));
        await fs.writeFile(`./filebeat/filebeat.yml`, '');
        await fs.writeFile(`./filebeat/filebeat.yml.template`, filebeatTemplate);
        await fs.writeFile(`./heartbeat/heartbeat.yml`, '');
        await fs.writeFile(`./heartbeat/heartbeat.yml.template`, heartbeatTemplate);
    });

    test.stdout()
        .command(['template', '--file', 'templateConfig.json'])
        // eslint-disable-next-line no-unused-vars
        .it('Change config of two files', _ctx => {
            const filebeatYml = fs.readFileSync(`./filebeat/filebeat.yml`).toString();
            expect(filebeatYml).to.equal(filebeatData);
            const heartbeatYml = fs.readFileSync(`./heartbeat/heartbeat.yml`).toString();
            expect(heartbeatYml).to.equal(heartbeatData);
        });

    after(async () => {
        await fs.remove('./filebeat');
        await fs.remove('./heartbeat');
        await fs.remove('./templateConfig.json');
    });
});
