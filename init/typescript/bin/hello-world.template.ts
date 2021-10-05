#!/usr/bin/env ts-node
import 'source-map-support/register';
import { prepareStack } from '@lotusengine/sdk';
import helloWorldStack from '../lib/helloWorldStack';

(async () => {
  await prepareStack(await helloWorldStack())
})()
