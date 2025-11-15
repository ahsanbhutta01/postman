import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import KeyValueFormEditor from "./KeyValueFormEditor";
import { RequestTab } from "../store/useRequestStore";
import { toast } from "sonner";
import BodyEditor from "./BodyEditor";

interface Props {
  tab: RequestTab;
  updateTab: (id: string, data: Partial<RequestTab>) => void;
}

const RequestEditorArea = ({ tab, updateTab }: Props) => {
  function parseKeyValuesData(jsonString?: string) {
    if (!jsonString) return [];

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return [];
    }
  }

  function getHeadersData() {
    const parsed = parseKeyValuesData(tab?.headers);
    return parsed.length > 0 ? parsed : [{ key: "", value: "", enabled: true }];
  }

  function getParametersData() {
    const parsed = parseKeyValuesData(tab?.parameters);
    return parsed.length > 0 ? parsed : [{ key: "", value: "", enabled: true }];
  }

  function getBodyData() {
    return {
      contentType: "application/json" as const,
      body: tab.body || "",
    };
  }

  function hanldeHeadersChange(
    data: { key: string; value: string; enabled?: boolean }[]
  ) {
    const filteredHeaders = data.filter(
      (item) => item.enabled !== false && (item.key.trim() || item.value.trim())
    );

    updateTab(tab?._id, { headers: JSON.stringify(filteredHeaders) });
    toast.success("Headers updated successfully!");
  }

  function hanldeParametersChange(
    data: { key: string; value: string; enabled?: boolean }[]
  ) {
    const filteredParams = data.filter(
      (item) => item.enabled !== false && (item.key.trim() || item.value.trim())
    );

    updateTab(tab?._id, { parameters: JSON.stringify(filteredParams) });
    toast.success("Parameters updated successfully!");
  }

  function handleBodyChange(data: { contentType: string; body?: string }) {
    updateTab(tab?._id, { body: data.body || "" });
    toast.success("Body updated successfully!");
  }

  return (
    <Tabs
      defaultValue="parameters"
      className="dark:bg-zinc-900  rounded-md w-full px-4 py-4">
      <TabsList className="dark:bg-zinc-800 bg-zinc-600  rounded-t-md">
        <TabsTrigger value="parameters" className="flex-1">
          Parameters
        </TabsTrigger>
        <TabsTrigger value="headers" className="flex-1">
          Headers
        </TabsTrigger>
        <TabsTrigger value="body" className="flex-1">
          Body
        </TabsTrigger>
      </TabsList>

      <TabsContent value="parameters">
        <KeyValueFormEditor
          initialData={getParametersData()}
          onSubmit={hanldeParametersChange}
          placeholder={{
            key: "Parameter Name",
            value: "Parameter Value",
            description: "URL Parameter",
          }}
        />
      </TabsContent>
      <TabsContent value="headers">
        <KeyValueFormEditor
          initialData={getHeadersData()}
          onSubmit={hanldeHeadersChange}
          placeholder={{
            key: "Parameter Name",
            value: "Parameter Value",
            description: "URL Parameter",
          }}
        />
      </TabsContent>
      <TabsContent value="body">
        <BodyEditor initialData={getBodyData()} onSubmit={handleBodyChange} />
      </TabsContent>
    </Tabs>
  );
};

export default RequestEditorArea;
