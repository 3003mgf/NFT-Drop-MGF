/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = "yrv0eaqg"
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"

export default defineCliConfig({ api: { projectId, dataset } })
