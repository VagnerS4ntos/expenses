"use client";
import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import UpdateName from "../components/settings/UpdateName";
import UpdateEmail from "../components/settings/UpdateEmail";
import UpdatePassword from "../components/settings/UpdatePassword";
import DeleteAccount from "../components/settings/DeleteAccount";

function Settings() {
  return (
    <section className="container py-20">
      <Tabs defaultFocus={true} forceRenderTabPanel={true}>
        <TabList>
          <Tab>Alterar nome</Tab>
          <Tab>Alterar e-mail</Tab>
          <Tab>Alterar senha</Tab>
          <Tab>Deletar contar</Tab>
        </TabList>

        <TabPanel>
          <UpdateName />
        </TabPanel>
        <TabPanel>
          <UpdateEmail />
        </TabPanel>
        <TabPanel>
          <UpdatePassword />
        </TabPanel>
        <TabPanel>
          <DeleteAccount />
        </TabPanel>
      </Tabs>
    </section>
  );
}

export default Settings;
