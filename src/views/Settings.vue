<template>
  <div>
  <v-card>
      <v-toolbar
      flat
      color="#5a3c57"
      dark
      >
      <v-toolbar-title>Settings</v-toolbar-title>
      </v-toolbar>
      <div class="d-flex flex-row">
        <v-tabs 
        direction="vertical" 
        v-model="tab"
        >
          <v-tab value="general">
            <v-icon start>
            mdi-cog
            </v-icon>
            General
          </v-tab>
          <v-tab value="accounts">
            <v-icon start>
            mdi-account
            </v-icon>
            Accounts
          </v-tab>
          <v-tab value="custom-rpc">
            <v-icon start>
              mdi-wifi
            </v-icon>
            Custom RPCs
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="general">
            <v-card flat>
            <v-card-text>
                <v-switch
                v-model="subgraphSettingsStore.settings.automaticIndexingRewards"
                :label="`Automatic Indexing Rewards*`"
                class="mb-0"
                ></v-switch>
                <p class="mb-8">
                    * Only functions with custom RPCs<br>
                    (Disable if there are issues with allocation wizard)
                </p>
                <h3>Subgraph Sync List (Manual)</h3>
                <v-textarea rows="3" v-model="subgraphSettingsStore.settings.subgraphSynclist"></v-textarea>
                <h3>Subgraph Blacklist</h3>
                <v-textarea rows="3" v-model="subgraphSettingsStore.settings.subgraphBlacklist"></v-textarea>
            </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item value="accounts">
            <v-card flat>
            <v-card-text style="width:450px">
                <AccountsEdit></AccountsEdit>
            </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item value="custom-rpc">
            <v-card flat>
            <v-card-text>
                <p>
                Use your own RPCs if the default are rate limited or you'd like to use auto indexing rewards feature
                </p>
                <br>
                <p>Mainnet</p>
                <v-row>
                  <v-checkbox v-model="mainnet_rpc_c"></v-checkbox>
                  <v-text-field v-if="mainnet_rpc_c" v-model="subgraphSettingsStore.settings.rpc.mainnet" @change="updateMainnetRPC"></v-text-field>
                </v-row>
                <p>Arbitrum</p>
                <v-row>
                  <v-checkbox v-model="arbitrum_rpc_c"></v-checkbox>
                  <v-text-field v-if="arbitrum_rpc_c" v-model="subgraphSettingsStore.settings.rpc.arbitrum" @change="updateArbitrumRPC"></v-text-field>
                </v-row>
            </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </div>
    </v-card>
  </div>
  </template>
  
  <script setup>
  import AccountsEdit from '@/components/AccountsEdit.vue';
  import { useSubgraphSettingStore } from '@/store/subgraphSettings';
  import { useChainStore } from '@/store/chains';
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import Web3 from 'web3';
  
  const subgraphSettingsStore = useSubgraphSettingStore();
  const subgraphSettings = storeToRefs(subgraphSettingsStore);
  const chainStore = useChainStore();
  const tab = ref("general");
  const mainnet_rpc_c = ref(subgraphSettingsStore.settings.rpc.mainnet != '');
  const arbitrum_rpc_c = ref(subgraphSettingsStore.settings.rpc.arbitrum != '');

  function updateMainnetRPC(rpc){
    if(rpc != '' && new Web3(rpc))
      chainStore.chains[0].web3 = new Web3(rpc);
    else
      chainStore.chains[0].web3 = new Web3(chainStore.chains[0].default_rpc);
  }
  function updateArbitrumRPC(rpc){
    if(rpc != '' && new Web3(rpc))
      chainStore.chains[1].web3 = new Web3(rpc);
    else
      chainStore.chains[1].web3 = new Web3(chainStore.chains[1].default_rpc);
  }
  </script>
  
  <style scoped>
  
  </style>