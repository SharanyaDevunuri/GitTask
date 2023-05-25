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

  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [field3, setField3] = useState("");
  const [field4, setField4] = useState("");
  const [field5, setField5] = useState("");
  const [field6, setField6] = useState("");
  const [field7, setField7] = useState("");
  const [field8, setField8] = useState("");
  const [field9, setField9] = useState("");
  const [amiOptions, setAmiOptions] = useState([]);
  const [instanceTypesOptions, setInstanceTypesOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [sha, setSha] = useState();

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

      const fileContent = window.atob(data.content);

      console.log(fileContent.match("(?<=name =)([^\n\r]*)"));
      setSelectedFileContent(fileContent);

      setEditedFileContent(fileContent);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
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
      `name = "${
        field4.length > 1
          ? field4
          : selectedFileContent.match(/name = "([^"]+)"/)[1]
      }"\n` +
      `app = "${
        field6.length > 1
          ? field6
          : selectedFileContent.match(/app = "([^"]+)"/)[1]
      }"\n` +
      `bucketName = "${
        field9.length > 1
          ? field9
          : selectedFileContent.match(/bucketName = "([^"]+)"/)[1]
      }"\n` +
      `Environment = "${
        field8.length > 1
          ? field8
          : selectedFileContent.match(/Environment = "([^"]+)"/)[1]
      }"\n` +
      `action = "${
        field7.length > 1
          ? field7
          : selectedFileContent.match(/action = "([^"]+)"/)[1]
      }"\n`;

    try {
      const encodedContent = window.btoa(editedFileContent);
      //const folderNames = "myapp";
      const randomFolderName =
        selectedFileContent.match(/name = "([^"]+)"/)[1] +
        "_updated_" +
        Math.random().toString(36).substring(7);

      const folderName = selectedFolder;
      console.log(selectedFolder);
      // ? randomFolderName
      // : selectedFolder + "/" + randomFolderName;

      // const filePath = `myapp/${folderName}/terraforms.tfvars`;
      const url = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${folderName}/terraforms.tfvars`;

      const branch = selectedBranch;
      console.log("url", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: "Update or create tfvars file",
          branch,
          content: encodedContent,
          sha: sha,
        }),
      });
      // Trigger Jenkins build
      const jenkinsUrl = "http://localhost:9071/data/trigger-jenkins-builds";
      const jenkinsParams = new URLSearchParams();
      jenkinsParams.append(
        "NAME",
        field4.length > 1
          ? field4
          : selectedFileContent.match(/name = "([^"]+)"/)[1]
      );

      jenkinsParams.append(
        "ENVIRONMENT",
        field8.length > 1
          ? field8
          : selectedFileContent.match(/Environment = "([^"]+)"/)[1]
      );
      jenkinsParams.append(
        "BUCKET NAME",
        field9.length > 1
          ? field9
          : selectedFileContent.match(/bucketName = "([^"]+)"/)[1]
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
      text: "S3 Updated",
      icon: "success",
    });
    // .then(function () {
    //   window.location.href = "http://localhost:3000/EditUser/undefined";
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
  const handleField8Change = (event) => {
    setField8(event.target.value);
  };
  const handleField9Change = (event) => {
    setField9(event.target.value);
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
          <h2>Service Catalog </h2>
          <ul>
            {folders.map(
              (folder) =>
                folder.name == "S3" && (
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
                    selectedFileContent.match(/name = "([^"]+)"/)[1]
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
                <label>ENVIRONMENT</label>
                <input
                  type="text"
                  defaultValue={
                    selectedFileContent.match(/Environment = "([^"]+)"/)[1]
                  }
                  onChange={handleField8Change}
                />
              </div>
              <div className="form-field">
                <label>BUCKET NAME</label>
                <input
                  type="text"
                  defaultValue={
                    selectedFileContent.match(/bucketName = "([^"]+)"/)[1]
                  }
                  onChange={handleField9Change}
                />
              </div>
              <div className="form-field">
                <label>ACTION</label>
                <select onChange={handleField7Change}>
                  <option disabled value="">
                    defaultValue=
                    {selectedFileContent.match(/action = "([^"]+)"/)[1]}
                  </option>
                  <option value="Option 1">apply</option>
                  <option value="Option 2">destroy</option>
                </select>
              </div>
              {/* <button onClick={handleEditClick}>Edit</button> */}
              {/* </div> */}

              <button onClick={handleSaveClick}>Save</button>
              <button onClick={handleCancelClick}>Cancel</button>
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
                  value={selectedFileContent.match(/name = "([^"]+)"/)[1]}
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
                <label>ENVIRONMENT</label>
                <input
                  disabled
                  type="text"
                  value={
                    selectedFileContent.match(/Environment = "([^"]+)"/)[1]
                  }
                />
              </div>
              <div className="form-field">
                <label>BUCKET NAME</label>
                <input
                  disabled
                  type="text"
                  value={selectedFileContent.match(/bucketName = "([^"]+)"/)[1]}
                />
              </div>
              <div className="form-field">
                <label>ACTION</label>
                <select selected disabled>
                  <option disabled>
                    {selectedFileContent.match(/action = "([^"]+)"/)[1]}
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
