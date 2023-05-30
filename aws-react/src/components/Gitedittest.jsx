import React, { useState, useEffect } from "react";
import ContentArea from "./ContentArea";
import swal from "sweetalert";

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

  const handleBranchSelect = (branchName) => {
    setSelectedBranch(branchName);
    setSelectedFolder("");
    setSubFolders([]);
    setFolderContents([]);
  };

  const handleFolderSelect = (folderPath) => {
    setSelectedFolder(folderPath);
    setSelectedFileContent("");
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

      console.log(fileContent.match("(?<=instance_name =)([^\n\r]*)"));
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
      `account = "${
        field5.length > 1
          ? field5
          : selectedFileContent.match(/account = "([^"]+)"/)[1]
      }"\n` +
      `instance_name = "${
        field4.length > 1
          ? field4
          : selectedFileContent.match(/instance_name = "([^"]+)"/)[1]
      }"\n` +
      `app = "${
        field6.length > 1
          ? field6
          : selectedFileContent.match(/app = "([^"]+)"/)[1]
      }"\n` +
      `instance_type = "${
        field3.length > 1
          ? field3
          : selectedFileContent.match(/instance_type = "([^"]+)"/)[1]
      }"\n` +
      `ami_id = "${
        field2.length > 1
          ? field2
          : selectedFileContent.match(/ami_id = "([^"]+)"/)[1]
      }"\n` +
      `subnet_id = "${
        field1.length > 1
          ? field1
          : selectedFileContent.match(/subnet_id = "([^"]+)"/)[1]
      }"\n` +
      `security_group_ids = ["sg-0cd060c8df19420a8"]\n\n` +
      `instance_tags = {\n  Environment = "production"\n}`;
    try {
      const encodedContent = window.btoa(editedFileContent);
      //const folderNames = "myapp";
      const randomFolderName =
        selectedFileContent.match(/instance_name = "([^"]+)"/)[1] +
        "_updated_" +
        Math.random().toString(36).substring(7);

      const folderName = selectedFolder;
      console.log(selectedFolder);
      //const folderName = 'sampleRepo/EC2/${selectedFolder}';
      // ? randomFolderName
      // : selectedFolder + "/" + randomFolderName;

      // const filePath = `myapp/${folderName}/terraforms.tfvars`;
      const url = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${folderName}/terraforms.tfvars`;
      // https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/EC2/wilton_lz8z0e/terraform.tfvars?ref=sampleRepo
      //const branch = Myrepo;
      console.log(selectedBranch);
      console.log("url", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: "Update or create tfvars file",
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
        }),
      });

      // Trigger Jenkins build
      const jenkinsUrl = "http://localhost:9071/data/trigger-jenkins-build";
      const jenkinsParams = new URLSearchParams();
      jenkinsParams.append(
        "NAME",
        field4.length > 1
          ? field4
          : selectedFileContent.match(/instance_name = "([^"]+)"/)[1]
      );
      jenkinsParams.append(
        "REGION",
        field1.length > 1
          ? field1
          : selectedFileContent.match(/subnet_id = "([^"]+)"/)[1]
      );
      jenkinsParams.append(
        "AMI",
        field2.length > 1
          ? field2
          : selectedFileContent.match(/ami_id = "([^"]+)"/)[1]
      );
      jenkinsParams.append(
        "INSTANCE_TYPE",
        field3.length > 1
          ? field3
          : selectedFileContent.match(/instance_type = "([^"]+)"/)[1]
      );
      jenkinsParams.append(
        "ACCOUNT",
        field5.length > 1
          ? field5
          : selectedFileContent.match(/account = "([^"]+)"/)[1]
      );
      jenkinsParams.append(
        "APP",
        field6.length > 1
          ? field6
          : selectedFileContent.match(/app = "([^"]+)"/)[1]
      );
      jenkinsParams.append(
        "ACTION",
        field7.length > 1
          ? field7
          : selectedFileContent.match(/action = "([^"]+)"/)[1]
      );

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

      if (!response.ok) {
        throw new Error(
          `Failed to save file content: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      console.log("Response Data:", data);

      // Update the selectedFileContent state with the updated content
      const updatedContent = window.atob(data.content);
      setSelectedFileContent(updatedContent);

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }

    swal({
      title: "UPDATED SUCCESSFULLY",
      text: "Instance Updated",
      icon: "success",
    });
    // .then(function () {

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

  console.log(selectedFileContent);
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
                folder.name == "EC2" && (
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
              <div className="form-field">
                <label>ACCOUNT</label>
                <input
                  type="text"
                  defaultValue={
                    selectedFileContent.match(/account = "([^"]+)"/)[1]
                  }
                  onChange={handleField5Change}
                />
              </div>
              <div className="form-field">
                <label>NAME</label>
                <input
                  type="text"
                  defaultValue={
                    selectedFileContent.match(/instance_name = "([^"]+)"/)[1]
                  }
                  onChange={handleField4Change}
                />
              </div>
              <div className="form-field">
                <label>APP</label>
                <input
                  type="text"
                  defaultValue={selectedFileContent.match(/app = "([^"]+)"/)[1]}
                  onChange={handleField6Change}
                />
              </div>
              <div className="form-field">
                <label>REGION</label>
                <select onChange={handleField1Change}>
                  <option value="" selected disabled>
                    {selectedFileContent.match(/subnet_id = "([^"]+)"/)[1]}
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
                    {selectedFileContent.match(/ami_id = "([^"]+)"/)[1]}
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
                </select>
              </div>
              {/* <div className="form-field">
                <label>ACTION</label>
                <select onChange={handleField7Change}>
                  <option value="Please select an option" selected disabled>
                    {selectedFileContent.match(/action = "([^"]+)"/)[1] ==
                    "Option 1"
                      ? "apply"
                      : "destroy"}
                  </option>
                  <option value="Option 1">apply</option>
                  <option value="Option 2">destroy</option>
                </select>
              </div> */}
              <div>
                <button onClick={handleSaveClick}>Save</button>
                <button onClick={handleCancelClick}>Cancel</button>
              </div>
              {(progressData && mergeStatus != "ahead") ||
                ("identical" && (
                  <div>
                    <br />
                    <label for="file">Requested for approval </label>
                    <progress id="file" value="50" max="100">
                      100%
                    </progress>
                  </div>
                ))}
              {(progressData && mergeStatus === "ahead") ||
                ("identical" && (
                  <div>
                    <br />
                    <label for="file">Approved Successfully</label>
                    <progress id="file" value="100" max="100">
                      100%
                    </progress>
                  </div>
                ))}
            </>
          ) : (
            <>
              <div className="form-field">
                <label>ACCOUNT</label>
                <input
                  type="text"
                  value={selectedFileContent.match(/account = "([^"]+)"/)[1]}
                  disabled
                />
              </div>
              <div className="form-field">
                <label>NAME</label>
                <input
                  type="text"
                  value={
                    selectedFileContent.match(/instance_name = "([^"]+)"/)[1]
                  }
                  disabled
                />
              </div>
              <div className="form-field">
                <label>APP</label>
                <input
                  type="text"
                  defaultValue={selectedFileContent.match(/app = "([^"]+)"/)[1]}
                  disabled
                />
              </div>
              <div className="form-field">
                <label>REGION</label>
                <select disabled>
                  <option value="" selected disabled>
                    {selectedFileContent.match(/subnet_id = "([^"]+)"/)[1]}
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
                <select disabled>
                  <option value="" selected disabled>
                    {selectedFileContent.match(/ami_id = "([^"]+)"/)[1]}
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
                <select disabled>
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
                </select>
              </div>
              <div className="form-field">
                <label>ACTION</label>
                <select disabled>
                  <option disabled value="">
                    Please select an option
                  </option>
                  <option value="Option 1">apply</option>
                  <option value="Option 2">destroy</option>
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
