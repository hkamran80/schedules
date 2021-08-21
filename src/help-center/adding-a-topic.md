You must be on a computer to follow these instructions. You cannot follow these instructions on your phone.

1. If you don't already have one, create a GitHub account
2. Fork the [Schedules repository](https://github.com/hkamran80/schedules)
    - A "fork" is a copy of a repository
    - A repository is essentially a giant folder
3. Make sure you're on the `edge` branch
    - Above the folder contents, there's a button with an icon and the word `main`. Click that, then click `edge`
4. Go into the folder `src/help-center` and click `Add file` then `Create new file`
5. Create an ID for your topic and set it as the filename
    - The ID should be all lowercase and have no spaces. Instead of spaces, use dashes (`-`)
    - For example, this help topic has the ID `adding-a-topic`, the installation topic has the ID of `installing-schedules`
6. Add the instructions
    - You can look at this topic's and the installation's topic's instructions in the repository
7. Commit your changes at the bottom
8. Go into the main `src` folder and click on `helpCenter.json` and click the pencil icon (edit)
9. At the bottom of the file, before the last curly brace (`}`), add the following:
    ```javascript
    "[topic ID]": {
        "name": "[topic name]",
        "description": "[topic description]",
        "videoLink": null
    }
    ```

    - Replace `[topic ID]` with the ID you created in step 4, and come up with a name and description for your topic
    - Make sure to put a comma and the end of the previous curly brace
10. Commit your changes at the bottom
11. Click on the `Pull requests` tab
12. Click `New pull request`
13. Make sure the base repository is set to `hkamran80/schedules`, the base is `edge`, the head repository is `[your GitHub username]/schedules`, and the compare is also `edge`
14. If all the values are the same, click `Create pull request`
15. Change the title to `New Topic: [your topic name]` and in the description, give a brief description of the topic
16. Click on `Assignees` in the sidebar, then click `hkamran80`
17. Click `Labels` under `Assignees`, then click `Help Center` and `Documentation`
18. Click `Create pull request`
19. After the PR is created, I will review it, then merge (add) it, request some changes, or deny it