import React, { useState, useEffect } from "react";
import "./ContentArea.css";
import GitComponent from "../components/GitComponent";
import Gitedittest from "../components/Gitedittest";
import swal from "sweetalert";

import S3editComponent from "./S3editComponent";

// import Gitviewer from "../components/Gitviewer";

interface ContentAreaProps {
  selectedButton: string | null;
}

interface AmiOption {
  value: string;
  label: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ selectedButton }) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [field3, setField3] = useState("");
  const [field4, setField4] = useState("");
  const [field5, setField5] = useState("");
  const [field6, setField6] = useState("");
  const [field7, setField7] = useState("");
  const [field8, setField8] = useState("");
  const [field9, setField9] = useState("");
  const [amiOptions, setAmiOptions] = useState<AmiOption[]>([]);
  const [regionOptions, setRegionOptions] = useState<AmiOption[]>([]);
  const [instancetypesOptions, setinstancetypesOptions] = useState<AmiOption[]>(
    []
  );
  const [actionOptions, setActionOptions] = useState<AmiOption[]>([]);

  useEffect(() => {
    fetch("http://localhost:9071/data/get-ami")
      .then((response) => response.json())
      .then((data) => {
        // Map the received data to an array of objects with value and label properties
        const options = data.map((value: string) => ({ value, label: value }));
        setAmiOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch AMI options:", error);
      });

    fetch("http://localhost:9071/data/instance-types")
      .then((response) => response.json())
      .then((data) => {
        // Map the received data to an array of objects with value and label properties
        const options = data.map((value: string) => ({ value, label: value }));
        setinstancetypesOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch instance types options:", error);
      });
    fetch("http://localhost:9071/data/regions")
      .then((response) => response.json())
      .then((data) => {
        // Map the received data to an array of objects with value and label properties
        const options = data.map((value: string) => ({ value, label: value }));
        setRegionOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch region options:", error);
      });
  }, []);

  const handleField1Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setField1(event.target.value);
  };

  const handleField2Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setField2(event.target.value);
  };

  const handleField3Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setField3(event.target.value);
  };

  const handleField4Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setField4(event.target.value);
  };
  const handleField5Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setField5(event.target.value);
  };
  const handleField6Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setField6(event.target.value);
  };
  const handleField7Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setField7(event.target.value);
  };
  const handleField8Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setField8(event.target.value);
  };
  const handleField9Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setField9(event.target.value);
  };
  function handleSelectChange(event: {
    target: { value: React.SetStateAction<string> };
  }) {
    setField7(event.target.value);
  }

  const handleSubmit = async () => {
    const apiUrl = "https://api.github.com";
    const repoOwner = "SharanyaDevunuri";
    const repoName = "terraformRepo";
    const folderNames = "EC2";

    // Step 1: Create the content in the desired format
    const content =
      `account = "${field5}"\n` +
      `instance_name = "${field4}"\n` +
      `app = "${field6}"\n` +
      `instance_type = "${field3}"\n` +
      `ami_id = "${field2}"\n` +
      `subnet_id = "${field1}"\n` +
      `security_group_ids = ["sg-0cd060c8df19420a8"]\n\n` +
      `instance_tags = {\n  Environment = "production"\n}\n` +
      `action = "${field7}"\n`;

    // Step 2: Encode the content to base64
    const contentEncoded = window.btoa(content);

    // Step 3: Get the existing file contents from GitHub
    // const fileUrl = `${apiUrl}/repos/${repoOwner}/${repoName}/contents/${folderName}/sample/terraforms.tfvars`;

    const randomFolderName = field4;

    const folderName = selectedFolder
      ? selectedFolder + "/" + randomFolderName
      : randomFolderName;
    const filePath = `EC2/${folderName}/terraforms.tfvars`;
    const fileUrl = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${filePath}`;

    // const folderName = selectedFolder
    //   ? randomFolderName
    //   : selectedFolder + "/" + randomFolderName;

    // const filePath = `myapp/${folderName}/terraforms.tfvars`;
    // const url = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/myapp/${folderName}`;
    console.log(fileUrl);
    const response = await fetch(fileUrl);
    const data = await response.json();
    const existingContent = data.content;

    // Step 4: Compare the existing and new contents
    if (contentEncoded === existingContent) {
      console.log("Content is already up to date.");
      return;
    }

    // Step 5: Create or update the file on GitHub
    const branch = "main";
    const commitMessage = "Update terraforms.tfvars";
    const updateUrl = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${filePath}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: contentEncoded,
        branch: branch,
        sha: data.sha,
      }),
    };

    try {
      // Create or update the file
      const updateResponse = await fetch(updateUrl, requestOptions);
      const updateData = await updateResponse.json();
      console.log("File updated successfully:", updateData);

      // Trigger Jenkins build
      const jenkinsUrl = "http://localhost:9071/data/trigger-jenkins-build";
      const jenkinsParams = new URLSearchParams();
      jenkinsParams.append("NAME", field4);
      jenkinsParams.append("REGION", field1);
      jenkinsParams.append("AMI", field2);
      jenkinsParams.append("INSTANCE_TYPE", field3);
      jenkinsParams.append("ACCOUNT", field5);
      jenkinsParams.append("APP", field6);
      jenkinsParams.append("ACTION", field7);

      const jenkinsRequestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: jenkinsParams.toString(),
      };

      const jenkinsResponse = await fetch(jenkinsUrl, jenkinsRequestOptions);
      const jenkinsData = await jenkinsResponse.json();
      console.log("Jenkins build triggered:", jenkinsData);
    } catch (error) {
      console.error("Error updating file or triggering Jenkins build:", error);
    }

    swal({
      title: "SUBMITTED",
      text: "Instance Created",
      icon: "success",
    });
    // .then(function () {
    //   window.location.href = "http://localhost:3000/EditUser/undefined";
    // });
  };

  const handleSubmitS3 = async () => {
    const apiUrl = "https://api.github.com";
    const repoOwner = "SharanyaDevunuri";
    const repoName = "terraformRepo";
    const folderNames = "S3";

    // Step 1: Create the content in the desired format
    const content =
      `account = "${field5}"\n` +
      `name = "${field4}"\n` +
      `app = "${field6}"\n` +
      `bucketName = "${field9}"\n` +
      // `instance_type = "${field3}"\n` +
      // `ami_id = "${field2}"\n` +
      `Environment = "${field8}"\n` +
      `action = "${field7}"\n`;
    //`action = "${field7}"\n`
    // Step 2: Encode the content to base64
    const contentEncoded = window.btoa(content);

    // Step 3: Get the existing file contents from GitHub
    // const fileUrl = `${apiUrl}/repos/${repoOwner}/${repoName}/contents/${folderName}/sample/terraforms.tfvars`;

    const randomFolderName = field4;

    const folderName = selectedFolder
      ? selectedFolder + "/" + randomFolderName
      : randomFolderName;
    const filePath = `S3/${randomFolderName}/terraforms.tfvars  `;
    const fileUrl = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${filePath}`;

    // const folderName = selectedFolder
    //   ? randomFolderName
    //   : selectedFolder + "/" + randomFolderName;

    // const filePath = `myapp/${folderName}/terraforms.tfvars`;
    // const url = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/myapp/${folderName}`;
    console.log(fileUrl);
    const response = await fetch(fileUrl);
    const data = await response.json();
    const existingContent = data.content;

    // Step 4: Compare the existing and new contents
    if (contentEncoded === existingContent) {
      console.log("Content is already up to date.");
      return;
    }

    // Step 5: Create or update the file on GitHub
    const branch = "main";
    const commitMessage = "Update terraforms.tfvars";
    const updateUrl = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${filePath}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: contentEncoded,
        branch: branch,
        sha: data.sha,
      }),
    };

    try {
      // Create or update the file
      const updateResponse = await fetch(updateUrl, requestOptions);
      const updateData = await updateResponse.json();
      console.log("File updated successfully:", updateData);

      // Trigger Jenkins build
      const jenkinsUrl = "http://localhost:9071/data/trigger-jenkins-builds";
      const jenkinsParams = new URLSearchParams();
      jenkinsParams.append("NAME", field4);
      jenkinsParams.append("ENVIRONMENT", field8);
      jenkinsParams.append("BUCKET_NAME", field9);
      jenkinsParams.append("ACCOUNT", field5);
      jenkinsParams.append("APP", field6);
      jenkinsParams.append("ACTION", field7);
      //jenkinsParams.append("ACTION", field7);

      const jenkinsRequestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: jenkinsParams.toString(),
      };

      const jenkinsResponse = await fetch(jenkinsUrl, jenkinsRequestOptions);
      const jenkinsData = await jenkinsResponse.json();
      console.log("Jenkins build triggered:", jenkinsData);
    } catch (error) {
      console.error("Error updating file or triggering Jenkins build:", error);
    }

    swal({
      title: "SUBMITTED",
      text: "S3 Created",
      icon: "success",
    });
    // .then(function () {
    //   window.location.href = "http://localhost:3000/EditUser/undefined";
    // });
  };

  const renderFields = () => {
    if (selectedButton === "Create EC2") {
      return (
        <>
          <div className="form-field">
            <label>ACCOUNT (Account name)</label>
            <input type="text" value={field5} onChange={handleField5Change} />
          </div>
          <div className="form-field">
            <label>NAME (Name of person)</label>
            <input type="text" value={field4} onChange={handleField4Change} />
          </div>
          <div className="form-field">
            <label>APP (App config name)</label>
            <input type="text" value={field6} onChange={handleField6Change} />
          </div>
          <div className="form-field">
            <label>REGION</label>
            <select onChange={handleField1Change}>
              <option value="" selected disabled>
                Please select an option
              </option>
              <option value="us-east-1">us-east-1</option>
              <option value="us-east-2">us-east-2</option>
              <option value="us-west-1">us-west-1</option>
              <option value="us-west-2">us-west-2</option>
              <option value="ap-southeast-1">ap-southeast-1</option>
              <option value="ap-northeast-1">ap-northeast-1</option>
              <option value="eu-west-1">eu-west-1</option>
              {/* {regionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))} */}
            </select>
          </div>
          <div className="form-field">
            <label>AMI</label>
            <select onChange={handleField2Change}>
              <option value="" selected disabled>
                Please select an option
              </option>
              {/* {amiOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))} */}
              <option value=" ami-02bf3fea296e7a751 ">
                Image ID: ami-02bf3fea296e7a751 OS: websoft9-redis6.0
              </option>
              <option value="ami-040f3334e1a9b3458">
                Image ID: ami-040f3334e1a9b3458 OS: spotlight-win2016-x64
              </option>
              <option value="ami-0d09e058a2a630df6">
                Image ID: ami-0d09e058a2a630df6 OS: bottlerocket-aws-k8s
              </option>
              <option value="ami-063cc140458d19824 ">
                Image ID: ami-063cc140458d19824 OS: bitnami-wildfly
              </option>
              <option value=" ami-0d351eeaab8a4441c ">
                Image ID: ami-0d351eeaab8a4441c OS: gravitational-teleport
              </option>
            </select>
          </div>
          <div className="form-field">
            <label>INSTANCE_TYPE</label>
            <select onChange={handleField3Change}>
              <option value="Please select an option" selected disabled>
                Please select an option
              </option>
              {/* {instancetypesOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))} */}
              <option value="c4.8xlarge">c4.8xlarge</option>
              <option value="t3.2xlarge">t3.2xlarge</option>
              <option value="t4g.nano">t4g.nano</option>
              <option value="m5d.8xlarge">m5d.8xlarge</option>
              <option value="i4i.16xlarge">i4i.16xlarge</option>
            </select>
          </div>
          <div className="form-field">
            <label>ACTION</label>
            <select value={field7} onChange={handleSelectChange}>
              <option disabled value="">
                Please select an option
              </option>
              <option value="Option 1">apply</option>
              <option value="Option 2">destroy</option>
            </select>
          </div>
          <button onClick={handleSubmit}>Submit</button>
        </>
      );
    } else if (selectedButton === "Create S3") {
      return (
        <>
          <div className="form-field">
            <label>ACCOUNT(Name of the Account)</label>
            <input type="text" value={field5} onChange={handleField5Change} />
          </div>
          <div className="form-field">
            <label>NAME (Name of the person)</label>
            <input type="text" value={field4} onChange={handleField4Change} />
          </div>
          <div className="form-field">
            <label>APP (App config name)</label>
            <input type="text" value={field6} onChange={handleField6Change} />
          </div>

          <div className="form-field">
            <label>ENVIRONMENT</label>
            <input type="text" value={field8} onChange={handleField8Change} />
          </div>
          <div className="form-field">
            <label>BUCKET NAME</label>
            <input type="text" value={field9} onChange={handleField9Change} />
          </div>
          <div className="form-field">
            <label>ACTION</label>
            <select value={field7} onChange={handleSelectChange}>
              <option disabled value="">
                Please select an option
              </option>
              <option value="Option 1">apply</option>
              <option value="Option 2">destroy</option>
            </select>
          </div>
          <button onClick={handleSubmitS3}>Submit</button>
        </>
      );
    } else if (selectedButton == "Edit S3") {
      return (
        <div className="form-field">
          <S3editComponent />
        </div>
      );
    } else {
      return (
        <div className="form-field">
          {/* <GitComponent /> */}
          <Gitedittest />
          {/* <S3editcomponent /> */}
          {/* <Gitviewer /> */}
        </div>
      );
    }
  };

  return (
    <div className="content-area">
      {selectedButton && (
        <>
          <h2>{selectedButton}</h2>
          {renderFields()}
        </>
      )}
    </div>
  );
};

export default ContentArea;
