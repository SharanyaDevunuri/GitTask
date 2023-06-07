import React, { useState, useEffect } from "react";
import ContentArea from "./ContentArea";
import swal from "sweetalert";
import axios from "axios";

import { Placeholder } from "react-bootstrap";

function GitRepoViewer() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [subFolders, setSubFolders] = useState([]);
  const [folderContents, setFolderContents] = useState([]);
  const [selectedFileContent, setSelectedFileContent] = useState();
  const [editedFileContent, setEditedFileContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [progressData, setProgressData] = useState(false);
  const [mergeStatus, setMergeStatus] = useState();
  const [fileContent, setFileContent] = useState("");
  const [shajen, setShajen] = useState();
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [field3, setField3] = useState("");
  const [field4, setField4] = useState("");
  const [field5, setField5] = useState("");
  const [field6, setField6] = useState("");
  const [field7, setField7] = useState("");

  const [amiOptions, setAmiOptions] = useState([]);
  const [instanceTypesOptions, setInstanceTypesOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [sha, setSha] = useState();
  const [shatoken, setShatoken] = useState();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedAMI, setSelectedAMI] = useState("");

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
    const fetchData = async () => {
      try {
        const amiResponse = await fetch("http://localhost:9071/data/get-ami");
        const amiData = await amiResponse.json();
        const amiOptions = amiData.map((value) => ({ value, label: value }));
        setAmiOptions(amiOptions);
      } catch (error) {
        console.error("Failed to fetch AMI options:", error);
      }

      try {
        const instanceTypesResponse = await fetch(
          "http://localhost:9071/data/instance-types"
        );
        const instanceTypesData = await instanceTypesResponse.json();
        const instanceTypesOptions = instanceTypesData.map((value) => ({
          value,
          label: value,
        }));
        setInstanceTypesOptions(instanceTypesOptions);
      } catch (error) {
        console.error("Failed to fetch instance types options:", error);
      }

      try {
        const regionsResponse = await fetch(
          "http://localhost:9071/data/regions"
        );
        const regionsData = await regionsResponse.json();
        const regionOptions = regionsData.map((value) => ({
          value,
          label: value,
        }));
        setRegionOptions(regionOptions);
      } catch (error) {
        console.error("Failed to fetch region options:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    // Fetch branches from the Git API
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/SharanyaDevunuri/terraformRepo/branches"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch branches");
        }
        const data = await response.json();
        setBranches(data);
        setSelectedBranch("main"); // Set the selected branch to "main"
      } catch (error) {
        console.error(error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    // Fetch folders based on the selected branch
    const fetchFolders = async () => {
      try {
        if (selectedBranch) {
          const response = await fetch(
            `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents?ref=${selectedBranch}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch folders");
          }
          const data = await response.json();
          setSha(data.sha);
          const folderEntries = data.filter((entry) => entry.type === "dir");
          setFolders(folderEntries);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFolders();
  }, [selectedBranch]);

  useEffect(() => {
    // Fetch subfolders and contents based on the selected folder
    const fetchSubFoldersAndContents = async () => {
      try {
        if (selectedBranch && selectedFolder) {
          const response = await fetch(
            `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${selectedFolder}?ref=${selectedBranch}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch subfolders and contents");
          }
          const data = await response.json();
          const subFolders = data.filter((entry) => entry.type === "dir");
          const contents = data.filter((entry) => entry.type === "file");
          setSubFolders(subFolders);
          setFolderContents(contents);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubFoldersAndContents();
  }, [selectedBranch, selectedFolder]);

  const handleFolderSelect = (folderPath) => {
    setSelectedFolder(folderPath);
    setSelectedFileContent("");
  };
  const regionsToAMIs = {
    "us-east-1": "ami-02bf3fea296e7a751",
    "us-east-2": "ami-040f3334e1a9b3458",
    "us-west-1": "ami-0f8e81a3da6e2510a",
    "us-west-2": "ami-063cc140458d19824",
    "ap-southeast-1": "ami-0d351eeaab8a4441c",
    "ap-northeast-1": "ami-xxxxxxxxxxxx",
    "eu-west-1": "ami-xxxxxxxxxxxx",
  };
  const handleField1Changes = (event) => {
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
  const handleField2Changes = (event) => {
    setSelectedAMI(event.target.value);
    setField2(event.target.value);
  };
  const handleFileSelect = async (filePath) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${filePath}?ref=${selectedBranch}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch file content");
      }
      const data = await response.json();
      console.log(data);
      setSha(data.sha);
      const responseRepo = await fetch(
        `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${filePath}?ref=${"Myrepo"}`
      );
      if (!responseRepo.ok) {
        throw new Error("Failed to fetch file content");
      }
      const dataRepo = await responseRepo.json();
      console.log(dataRepo);
      setShatoken(dataRepo.sha);

      const fileContent = window.atob(data.content);

      console.log(fileContent.match("(?<=tags =)([^\n\r]*)"));
      setSelectedFileContent(fileContent);

      setEditedFileContent(fileContent);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = async () => {
    setProgressData(true);
    setIsEditing(true);
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
  };

  const handleSaveClick = async () => {
    console.log("i am on handlesaveclick");
    //condition ? exprIfTrue : exprIfFalse
    const editedFileContent =
      // `account = "${
      //   field5.length > 1
      //     ? field5
      //     : selectedFileContent.match(/account = "([^"]+)"/)[1]
      // }"\n` +
      `tags = "${
        field4.length > 1
          ? field4
          : selectedFileContent.match(/tags = "([^"]+)"/)[1]
      }"\n` +
      // `app = "${
      //   field6.length > 1
      //     ? field6
      //     : selectedFileContent.match(/app = "([^"]+)"/)[1]
      // }"\n` +
      `instance_type = "${
        field3.length > 1
          ? field3
          : selectedFileContent.match(/instance_type = "([^"]+)"/)[1]
      }"\n` +
      `ami = "${
        field2.length > 1
          ? field2
          : selectedFileContent.match(/ami = "([^"]+)"/)[1]
      }"\n` +
      `region = "${
        field1.length > 1
          ? field1
          : selectedFileContent.match(/region = "([^"]+)"/)[1]
      }"\n`;
    //  `tags = "production"\n`;

    const encodedContent = window.btoa(editedFileContent);
    try {
      //const folderNames = "myapp";
      // const randomFolderName =
      //   selectedFileContent.match(/tags = "([^"]+)"/)[1]
      //   +
      //   "_updated_" +
      //   Math.random().toString(36).substring(7);
      const filePath = `configs/${
        selectedFileContent.match(/tags = "([^"]+)"/)[1]
      }/terraforms.tfvars`;
      const folderName = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${filePath}`;
      console.log(selectedFolder);
      //const folderName = 'sampleRepo/EC2/${selectedFolder}';
      // ? randomFolderName
      // : selectedFolder + "/" + randomFolderName;

      // const filePath = `myapp/${folderName}/terraforms.tfvars`;
      // const filePath = `configs/${folderName}/terraforms.tfvars`;
      const url = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${filePath}`;
      // https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/EC2/wilton_lz8z0e/terraform.tfvars?ref=sampleRepo
      //const branch = Myrepo;

      console.log("url", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: selectedFileContent.match(/tags = "([^"]+)"/)[1],
          //  branch,
          content: encodedContent,
          sha: shatoken,
        }),
      });
      const mergeurl =
        "https://api.github.com/repos/SharanyaDevunuri/terraformRepo/merges";
      console.log("i am in merge");
      const responsemerge = await fetch(mergeurl, {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: "Merge tfvars file",
          // branch,
          base: "main",
          head: "Myrepo",
          message: "Merge Myrepo into main from ec2 edit",
        }),
      });

      const data = await response.json();

      console.log("Response Data:", data);

      // Update the selectedFileContent state with the updated content
      const updatedContent = window.atob(data.content);
      setSelectedFileContent(updatedContent);

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }

    const regex = /configs\/(.*?)\//;
    const match = fileContent.match(regex);
    const applyreg = /terraform\s+(\S+)\s+--auto-approve/;
    const regmatch = fileContent.match(applyreg);
    console.log(match);

    let modifiedContent = fileContent;
    if (match && regmatch) {
      modifiedContent = fileContent.replace(
        match[1],
        selectedFileContent.match(/tags = "([^"]+)"/)[1]
      );
      modifiedContent = modifiedContent.replace(
        match[1],
        selectedFileContent.match(/tags = "([^"]+)"/)[1]
      );
      modifiedContent = modifiedContent.replace(
        match[1],
        selectedFileContent.match(/tags = "([^"]+)"/)[1]
      );
      if (field7 == "apply") {
        modifiedContent = modifiedContent.replace(regmatch[1], "apply");
      }
      if (field7 == "destroy") {
        modifiedContent = modifiedContent.replace(regmatch[1], "destroy");
      }
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
        message: selectedFileContent.match(/tags = "([^"]+)"/)[1],
        //  branch,
        content: window.btoa(modifiedContent),
        sha: shadata,
      }),
    });

    swal({
      title: "UPDATED SUCCESSFULLY",
      text: "Instance Updated",
      icon: "success",
    });
    // .then(function () {
    //   window.location.href = "http://localhost:3000";
    // });
  };

  const handleCancelClick = () => {
    setEditedFileContent(selectedFileContent);
    setIsEditing(false);
  };

  const handleFileContentChange = (event) => {
    setEditedFileContent(event.target.value);
  };

  const handleField1Change = (event) => {
    setField1(event.target.value);
  };

  const handleField2Change = (event) => {
    setField2(event.target.value);
  };

  const handleField3Change = (event) => {
    setField3(event.target.value);
  };

  const handleField4Change = (event) => {
    setField4(event.target.value);
  };

  const handleField5Change = (event) => {
    setField5(event.target.value);
  };

  const handleField6Change = (event) => {
    setField6(event.target.value);
  };
  const handleField7Change = (event) => {
    setField7(event.target.value);
  };

  return (
    <div>
      {/* <h2>Branches</h2>
      <ul>
        {branches.map((branch) => (
          <li key={branch.name}>
            <button onClick={() => handleBranchSelect(branch.name)}>
              {branch.name}
            </button>
          </li>
        ))}
      </ul> */}
      {selectedBranch && (
        <>
          <h2>Service Catalog</h2>
          <ul>
            {folders.map(
              (folder) =>
                folder.name == "configs" && (
                  <li key={folder.path}>
                    <button onClick={() => handleFolderSelect(folder.path)}>
                      {folder.name}
                    </button>
                  </li>
                )
            )}
          </ul>
        </>
      )}
      {selectedFolder && (
        <>
          <h2>Service</h2>
          <ul>
            {subFolders.map((subFolder) => (
              <li key={subFolder.path}>
                <button onClick={() => handleFolderSelect(subFolder.path)}>
                  {subFolder.name}
                </button>
              </li>
            ))}
          </ul>
          <h2>tfvars Parameters</h2>
          <ul>
            {folderContents.map((content) => (
              <li key={content.path}>
                <button onClick={() => handleFileSelect(content.path)}>
                  {content.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {selectedFileContent && (
        <>
          <h2>Terraform tfvars</h2>
          {isEditing ? (
            <>
              {/* <div className="form-field">
                <label>ACCOUNT</label>
                <input
                  type="text"
                  defaultValue={
                    selectedFileContent.match(/account = "([^"]+)"/)[1]
                  }
                  onChange={handleField5Change}
                />
              </div> */}
              <div className="form-field">
                <label>TAG NAME</label>
                <input
                  type="text"
                  defaultValue={
                    selectedFileContent.match(/tags = "([^"]+)"/)[1]
                  }
                  onChange={handleField4Change}
                />
              </div>
              {/* <div className="form-field">
                <label>APP</label>
                <input
                  type="text"
                  defaultValue={selectedFileContent.match(/app = "([^"]+)"/)[1]}
                  onChange={handleField6Change}
                />
              </div> */}
              <div className="form-field">
                <label>REGION</label>
                <select onChange={handleField1Changes}>
                  <option value="Please select an option" selected disabled>
                    {selectedFileContent.match(/region = "([^"]+)"/)[1]}
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
                  <option value="Please select an option" selected disabled>
                    {selectedFileContent.match(/ami = "([^"]+)"/)[1]}
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
                    {selectedFileContent.match(/instance_type = "([^"]+)"/)[1]}
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
                  <option value="t2.micro">t2.micro</option>
                </select>
              </div>
              <div className="form-field">
                <label>ACTION</label>
                <select value={field7} onChange={handleField7Change}>
                  <option disabled value="">
                    apply
                  </option>
                  <option value="apply">apply</option>
                  <option value="destroy">destroy</option>
                </select>
              </div>
              <div>
                <button onClick={handleSaveClick}>Save</button>
                <button onClick={handleCancelClick}>Cancel</button>
              </div>
              {/* {progressData && mergeStatus != "identical" && (
                <div>
                  <br />
                  <label for="file">Request Status </label>
                  <progress id="file" value="50" max="100">
                    100%
                  </progress>
                </div>
              )}
              {progressData && mergeStatus == "identical" && (
                <div>
                  <br />
                  <label for="file">Approved Successfully</label>
                  <progress id="file" value="100" max="100">
                    100%
                  </progress>
                </div>
              )} */}
            </>
          ) : (
            <>
              <div className="form-field">
                <label>TAG NAME</label>
                <input
                  type="text"
                  value={selectedFileContent.match(/tags = "([^"]+)"/)[1]}
                  onChange={handleField4Change}
                  disabled
                />
              </div>
              {/* <div className="form-field">
                <label>APP</label>
                <input
                  type="text"
                  defaultValue={selectedFileContent.match(/app = "([^"]+)"/)[1]}
                  onChange={handleField6Change}
                />
              </div> */}
              <div className="form-field">
                <label>REGION</label>
                <select onChange={handleField1Changes} disabled>
                  <option selected disabled>
                    {selectedFileContent.match(/region = "([^"]+)"/)[1]}
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
                <select onChange={handleField2Changes} disabled>
                  <option selected disabled>
                    {selectedFileContent.match(/ami = "([^"]+)"/)[1]}
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
                <select onChange={handleField3Change} disabled>
                  <option selected disabled>
                    {selectedFileContent.match(/instance_type = "([^"]+)"/)[1]}
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
                  <option value="t2.micro">t2.micro</option>
                </select>
              </div>
              <div className="form-field">
                <label>ACTION</label>
                <select value={field7} onChange={handleField7Change} disabled>
                  <option selected disabled>
                    apply
                  </option>
                  <option value="apply">apply</option>
                  <option value="destroy">destroy</option>
                </select>
              </div>
              <button onClick={handleEditClick}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default GitRepoViewer;
