const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
import setupDb from './setup/db.setup';
import { bootstrap } from './setup/bootstrapCredential';
import { logger } from './config';
export default async function setCmdArgs() {
  const optionDefinitions = [
    {
      name: 'help',
      alias: 'h',
      type: Boolean,
      description: 'Display this usage guide.',
    },
    {
      name: 'version',
      alias: 'v',
      type: Boolean,
      description: 'Displays current version',
    },
    {
      name: 'newdb',
      alias: 'n',
      type: Boolean,
      description: 'Setup the database.',
    },
    {
      name: 'bootstrap',
      alias: 'b',
      type: Boolean,
      description: 'Register a did and HypersignAuthCredentail on the network.',
    },
  ];
  const options = commandLineArgs(optionDefinitions);
  if (options.help) {
    const usage = commandLineUsage([
      {
        header: 'Studio',
        content: 'A web portal to issue and verify credentails',
      },
      {
        header: 'Options',
        optionList: optionDefinitions,
      },
      {
        content: 'Project home: {underline https://github.com/hypersignprotocol/studio}',
      },
    ]);
    logger.info(usage);
    return false;
  } else if (options.newdb) {
    logger.info('=====================Setting Up database===========================');
    await setupDb();
    logger.info('=====================Setting Up database===========================');
    return false;
  } else if (options.bootstrap) {
    logger.info('=====================Bootstraping did/schemas===========================');
    await bootstrap();
    logger.info('=====================Bootstraping did/schemas===========================');
  } else {
    logger.info(options);
    return true;
  }
}
