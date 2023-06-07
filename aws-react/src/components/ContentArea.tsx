import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import "./ContentArea.css";
import GitComponent from "../components/GitComponent";
import Gitedittest from "../components/Gitedittest";
import swal from "sweetalert";
import LoginForm from "./loginform";

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
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [field3, setField3] = useState("");
  const [field4, setField4] = useState("");
  const [field5, setField5] = useState("");
  const [field6, setField6] = useState("");
  const [field7, setField7] = useState("");
  const [field8, setField8] = useState("");
  const [field9, setField9] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [shajen, setShajen] = useState();

  const [progressData, setProgressData] = useState(false);
  const [mergeStatus, setMergeStatus] = useState();
  const [amiOptions, setAmiOptions] = useState<AmiOption[]>([]);
  const [regionOptions, setRegionOptions] = useState<AmiOption[]>([]);
  const [instancetypesOptions, setinstancetypesOptions] = useState<AmiOption[]>(
    []
  );
  const [actionOptions, setActionOptions] = useState<AmiOption[]>([]);
  const [shatoken, setShatoken] = useState();
  interface RegionOption {
    value: string;
    label: string;
  }

  interface AMIOption {
    value: string;
    label: string;
  }

  const regionsToAMIs: Record<string, string> = {
    "us-east-1": "ami-02bf3fea296e7a751",
    "us-east-2": "ami-040f3334e1a9b3458",
    "us-west-1": "ami-0f8e81a3da6e2510a",
    "us-west-2": "ami-063cc140458d19824",
    "ap-southeast-1": "ami-0d351eeaab8a4441c",
  };

  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedAMI, setSelectedAMI] = useState<string>("");

  const handleField1Changes = (event: ChangeEvent<HTMLSelectElement>) => {
    const region = event.target.value;
    setField1(event.target.value);
    setSelectedRegion(region);
    const ami = regionsToAMIs[region];
    setSelectedAMI(ami);
    if (event.target.value == "us-west-1") {
      setField2("ami-0f8e81a3da6e2510a");
    } else if (event.target.value == "us-east-1") {
      setField2("ami-02bf3fea296e7a751");
    } else if (event.target.value == "us-east-2") {
      setField2("ami-040f3334e1a9b3458");
    } else if (event.target.value == "ap-southeast-1") {
      setField2("ami-0d351eeaab8a4441c");
    } else if (event.target.value == "us-west-2") {
      setField2("ami-063cc140458d19824");
    }
  };

  const handleField2Changes = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAMI(event.target.value);
    setField2(event.target.value);
  };
  interface ContentAreaProps {
    selectedButton: string | null;
  }

  interface AmiOption {
    value: string;
    label: string;
  }

  useEffect(() => {
    // Fetch the file content
    axios
      .get(
        "https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/Jenkinsfile"
      )
      .then((response) => {
        const jenkinscontent = window.atob(response.data.content); // Decoding base64 content
        setFileContent(jenkinscontent);
      })
      .catch((error) => {
        console.error("Error fetching file content:", error);
      });
  }, []);

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

  const handleField2Change = (event: ChangeEvent<HTMLSelectElement>) => {
    const ami = event.target.value;
    setSelectedAMI(ami);
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
    console.log(field2);
    setProgressData(true);
    const statusurl =
      "https://api.github.com/repos/SharanyaDevunuri/terraformRepo/compare/main...Myrepo";
    console.log("i am in status");
    const responsestatus = await fetch(statusurl, {
      method: "GET",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
    });

    setMergeStatus((await responsestatus.json()).status);
    const apiUrl = "https://api.github.com";
    const repoOwner = "SharanyaDevunuri";
    const repoName = "terraformRepo";
    const folderNames = "EC2";

    // Step 1: Create the content in the desired format
    const content =
      // `account = "${field5}"\n` +
      `tags = "${field4}"\n` +
      // `app = "${field6}"\n` +
      `instance_type = "${field3}"\n` +
      `ami = "${field2}"\n` +
      `region = "${field1}"\n`;
    // `security_group_ids = ["sg-0cd060c8df19420a8"]\n\n` +
    //`tags =  "production"\n`;

    // `action = "apply"\n`;

    // Step 2: Encode the content to base64
    const contentEncoded = window.btoa(content);

    // Step 3: Get the existing file contents from GitHub
    // const fileUrl = `${apiUrl}/repos/${repoOwner}/${repoName}/contents/${folderName}/sample/terraforms.tfvars`;

    const randomFolderName = field4;

    const folderName = selectedFolder
      ? selectedFolder + "/" + randomFolderName
      : randomFolderName;
    const filePath = `configs/${folderName}/terraforms.tfvars`;
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
    // const branch = "main";
    const commitMessage = field4;
    const updateUrl = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${filePath}`;

    // const requestOptions = {
    //   method: "PUT",
    //   headers: {
    //     Authorization: "Bearer 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",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     message: commitMessage,
    //     content: contentEncoded,
    //     // branch: branch,
    //     sha: data.sha,
    //   }),
    // };
    const requestOptions = await fetch(fileUrl, {
      method: "PUT",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        // branch,
        message: commitMessage,
        content: contentEncoded,
        // branch: branch,
        sha: data.sha,
      }),
    });
    const mergeurl =
      "https://api.github.com/repos/SharanyaDevunuri/terraformRepo/merges";
    console.log("i am in ec2 merge");
    const responsemerge = await fetch(mergeurl, {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        // branch,
        base: "Myrepo",
        head: "main",
        message: "Merge Myrepo into main from create ec2",
      }),
    });
    console.log(fileContent);

    const regex = /configs\/(.*?)\//;
    const match = fileContent.match(regex);
    const applyreg = /terraform\s+(\S+)\s+--auto-approve/;
    const regmatch = fileContent.match(applyreg);
    console.log(regmatch);

    let modifiedContent = fileContent;
    if (match && regmatch) {
      modifiedContent = fileContent.replace(match[1], field4);
      modifiedContent = modifiedContent.replace(match[1], field4);
      modifiedContent = modifiedContent.replace(match[1], field4);

      modifiedContent = modifiedContent.replace(regmatch[1], "apply");

      // if (field7 == "Option 2") {
      //   modifiedContent = modifiedContent.replace(regmatch[1], "destroy");
      // }
    }
    console.log(modifiedContent);

    //const replacevar = fileContent.match(/configs\/([^/]+)/)[1]

    // {fileContent.match(/configs\/([^/]+)/)[1]}
    console.log(modifiedContent);
    const jenkinsurl = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/Jenkinsfile`;
    // https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/EC2/wilton_lz8z0e/terraform.tfvars?ref=sampleRepo
    //const branch = Myrepo;
    const responsestatusjen = await fetch(jenkinsurl, {
      method: "GET",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
    });
    //console.log(responsestatusjen);
    const dataRepo = await responsestatusjen.json();
    console.log(dataRepo.sha);
    setShajen(dataRepo.sha);
    console.log(shajen);
    let shadata = dataRepo.sha;
    const responsejenkins = await fetch(jenkinsurl, {
      method: "PUT",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: field4 + " apply",
        //  branch,
        content: window.btoa(modifiedContent),
        sha: shadata,
      }),
    });

    // try {
    //   // Create or update the file
    //   const updateResponse = await fetch(updateUrl, requestOptions);
    //   const updateData = await updateResponse.json();
    //   console.log("File updated successfully:", updateData);

    //   // Trigger Jenkins build
    //   const jenkinsUrl = "http://localhost:9071/data/trigger-jenkins-build";
    //   const jenkinsParams = new URLSearchParams();
    //   jenkinsParams.append("NAME", field4);
    //   jenkinsParams.append("REGION", field1);
    //   jenkinsParams.append("AMI", field2);
    //   jenkinsParams.append("INSTANCE_TYPE", field3);
    //   jenkinsParams.append("ACCOUNT", field5);
    //   jenkinsParams.append("APP", field6);
    //   jenkinsParams.append("ACTION", field7);

    //   const jenkinsRequestOptions = {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: jenkinsParams.toString(),
    //   };

    //   const jenkinsResponse = await fetch(jenkinsUrl, jenkinsRequestOptions);
    //   const jenkinsData = await jenkinsResponse.json();
    //   console.log("Jenkins build triggered:", jenkinsData);
    // } catch (error) {
    //   console.error("Error updating file or triggering Jenkins build:", error);
    // }

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
    setProgressData(true);
    const statusurl =
      "https://api.github.com/repos/SharanyaDevunuri/terraformRepo/compare/main...Myrepo";
    console.log("i am in status");
    const responsestatus = await fetch(statusurl, {
      method: "GET",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
    });

    setMergeStatus((await responsestatus.json()).status);
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
    // const branch = "main";
    const commitMessage = field4;

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
        //  branch: branch,
        sha: data.sha,
      }),
    };
    const mergeurl =
      "https://api.github.com/repos/SharanyaDevunuri/terraformRepo/merges";
    const responsemerge = await fetch(mergeurl, {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        // branch,

        base: "main",
        head: "Myrepo",
        message: "Merge Myrepo into main from create s3 ",
      }),
    });

    try {
      // Create or update the file
      const updateResponse = await fetch(updateUrl, requestOptions);
      const updateData = await updateResponse.json();
      console.log("File updated successfully:", updateData);
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
    if (selectedButton === "Request EC2") {
      return (
        <>
          {/* <div className="form-field">
            <label>ACCOUNT (Account name)</label>
            <input type="text" value={field5} onChange={handleField5Change} />
          </div> */}

          {/* <div className="form-field">
            <label>APP (App config name)</label>
            <input type="text" value={field6} onChange={handleField6Change} />
          </div> */}
          <div className="form-field">
            <label>REGION</label>
            <select onChange={handleField1Changes} value={selectedRegion}>
              <option value="" disabled>
                Please select an option
              </option>
              <option value="us-east-1">us-east-1</option>
              <option value="us-east-2">us-east-2</option>
              <option value="us-west-1">us-west-1</option>
              <option value="us-west-2">us-west-2</option>
              <option value="ap-southeast-1">ap-southeast-1</option>
            </select>
          </div>
          <div className="form-field">
            <label>AMI</label>
            <select onChange={handleField2Changes} value={selectedAMI}>
              <option value="" disabled>
                Please select an option
              </option>
              {selectedRegion === "us-west-1" && (
                <>
                  <option value="ami-0f8e81a3da6e2510a">
                    Image ID: ami-0f8e81a3da6e2510a
                  </option>
                </>
              )}
              {selectedRegion === "us-east-1" && (
                <>
                  <option value="ami-02bf3fea296e7a751">
                    Image ID: ami-02bf3fea296e7a751
                  </option>
                </>
              )}
              {selectedRegion === "ap-southeast-1" && (
                <>
                  <option value="ami-0d351eeaab8a4441c">
                    Image ID: ami-0d351eeaab8a4441c
                  </option>
                </>
              )}
              {selectedRegion === "us-west-2" && (
                <>
                  <option value="ami-0f8e81a3da6e2510a">
                    Image ID: ami-0f8e81a3da6e2510a
                  </option>
                </>
              )}

              {/* Add other AMI options for other regions */}
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
              <option value="t2.micro">t2.micro</option>
              <option value="m5d.8xlarge">m5d.8xlarge</option>
              <option value="i4i.16xlarge">i4i.16xlarge</option>
            </select>
          </div>
          <div className="form-field">
            <label>TAG NAME</label>
            <input type="text" value={field4} onChange={handleField4Change} />
          </div>
          {/* <div className="form-field">
            <label>ACTION</label>
            <select value={field7} onChange={handleSelectChange}>
              <option disabled value="">
                Please select an option
              </option>
              <option value="Option 1">apply</option>
              <option value="Option 2">destroy</option>
            </select>
          </div> */}
          <button onClick={handleSubmit}>Submit EC2 request</button>
        </>
      );
    } else if (selectedButton === "Request S3") {
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
          {/* <div className="form-field">
            <label>ACTION</label>
            <select value={field7} onChange={handleSelectChange}>
              <option disabled value="">
                Please select an option
              </option>
              <option value="Option 1">apply</option>
              <option value="Option 2">destroy</option>
            </select>
          </div> */}
          <button onClick={handleSubmitS3}>Submit S3</button>
          {/* {progressData && mergeStatus != "identical" && (
            <div>
              <br />
              <label>Requested for approval </label>
              <progress id="file" value="50" max="100">
                100%
              </progress>
            </div>
          )}
          {progressData && mergeStatus == "identical" && (
            <div>
              <br />
              <label>Approved Successfully</label>
              <progress id="file" value="100" max="100">
                100%
              </progress>
            </div>
          )} */}
        </>
      );
    } else if (selectedButton == "Modify S3") {
      return (
        <div className="form-field">
          <S3editComponent />
        </div>
      );
    } else if (selectedButton == "Login") {
      return (
        <div className="form-field">
          <LoginForm />
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
          <h2 style={{ marginLeft: "336px", marginBottom: "28px" }}>
            {selectedButton}
          </h2>
          {renderFields()}
        </>
      )}
    </div>
  );
};

export default ContentArea;
