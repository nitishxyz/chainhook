/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "ChainhookAuth": {
      "type": "sst.aws.Auth"
      "url": string
    }
    "ChainhookDatabase": {
      "clusterArn": string
      "database": string
      "host": string
      "password": string
      "port": number
      "reader": string
      "secretArn": string
      "type": "sst.aws.Aurora"
      "username": string
    }
    "ChainhookPlatform": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
    "GithubClientId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GithubClientSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "chainhookVpc": {
      "bastion": string
      "type": "sst.aws.Vpc"
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}