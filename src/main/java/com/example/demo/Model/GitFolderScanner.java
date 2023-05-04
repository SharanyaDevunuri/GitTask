package com.example.demo.Model;

import java.io.File;
import java.io.IOException;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class GitFolderScanner {

private final String gitLocalPath = "C:\\Users\\sdevunuri\\Downloads\\demo";
private final String gitRemotePath = "https://github.com/SharanyaDevunuri/GitTask.git";
private final String gitUsername = "sdevunuri@teksystems.com";
private final String gitPassword = "Sharanya890@";
private final String folderPath = "C:\\Users\\sdevunuri\\Downloads\\demo";

@Scheduled(fixedDelay = 60000)
public void scanFolder() throws IOException, GitAPIException {
FileRepositoryBuilder builder = new FileRepositoryBuilder();
Repository repository = builder.setGitDir(new File(gitLocalPath + "/.git")).readEnvironment().findGitDir().build();
Git git = new Git(repository);

git.pull().setCredentialsProvider(new UsernamePasswordCredentialsProvider(gitUsername, gitPassword)).call();

File folder = new File(folderPath);
if (folder.exists()) {
for (File file : folder.listFiles()) {
if (file.isDirectory()) {
scanSubFolder(file, git);
}
}
}

git.add().addFilepattern(".").call();
git.commit().setMessage("Auto commit - Folder changes").call();
git.push().setCredentialsProvider(new UsernamePasswordCredentialsProvider(gitUsername, gitPassword)).call();;
}

private void scanSubFolder(File folder, Git git) throws IOException, GitAPIException {
for (File file : folder.listFiles()) {
if (file.isDirectory()) {
scanSubFolder(file, git);
}
}
git.add().addFilepattern(folder.getPath()).call();;
}
}