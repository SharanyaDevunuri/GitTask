import React, { useState, useEffect } from "react";

function GitRepoViewer() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [subFolders, setSubFolders] = useState([]);
  const [folderContents, setFolderContents] = useState([]);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [editedFileContent, setEditedFileContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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
      const fileContent = window.atob(data.content);
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
    try {
      const encodedContent = window.btoa(editedFileContent);
      const randomFolderName =
        "test_" + Math.random().toString(36).substring(7);
      const sample = selectedFolder
        ? selectedFolder + "/" + randomFolderName
        : randomFolderName;
      const filePath = `${sample}/terraforms.tfvars`;
      const url = `https://api.github.com/repos/SharanyaDevunuri/terraformRepo/contents/${filePath}`;
      const branch = selectedBranch;

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
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save file content");
      }

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelClick = () => {
    setEditedFileContent(selectedFileContent);
    setIsEditing(false);
  };

  const handleFileContentChange = (event) => {
    setEditedFileContent(event.target.value);
  };

  return (
    <div>
      <h1>Git Repository Viewer</h1>
      <h2>Branches</h2>
      <ul>
        {branches.map((branch) => (
          <li key={branch.name}>
            <button onClick={() => handleBranchSelect(branch.name)}>
              {branch.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedBranch && (
        <>
          <h2>Folders</h2>
          <ul>
            {folders.map((folder) => (
              <li key={folder.path}>
                <button onClick={() => handleFolderSelect(folder.path)}>
                  {folder.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {selectedFolder && (
        <>
          <h2>Subfolders</h2>
          <ul>
            {subFolders.map((subFolder) => (
              <li key={subFolder.path}>
                <button onClick={() => handleFolderSelect(subFolder.path)}>
                  {subFolder.name}
                </button>
              </li>
            ))}
          </ul>
          <h2>Folder Contents</h2>
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
          <h2>File Content</h2>
          {isEditing ? (
            <>
              <textarea
                value={editedFileContent}
                onChange={handleFileContentChange}
              />
              <button onClick={handleSaveClick}>Save</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </>
          ) : (
            <>
              <pre>{selectedFileContent}</pre>
              <button onClick={handleEditClick}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default GitRepoViewer;
