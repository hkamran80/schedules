<template>
    <div id="app">
        <navigation :schedules="schedules" />
        <router-view :schedules="schedules" />
    </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
export default {
    name: "App",
    data: () => ({
        schedules: {
            "ca-auhsd-hss": {
                name: "AUHSD Standard Schedule",
                short_name: "AUHSD Standard",
                icon: "mdi-school",
                color: "#343254",
                schedule:
                    '{"MON":{"1st Period":["8-35-00","9-20-00"],"Passing: 1/2":["9-20-01","9-25-00"],"2nd Period":["9-25-01","10-10-00"],"Passing: 2/3":["10-10-01","10-15-00"],"3rd Period":["10-15-01","11-00-00"],"Brunch":["11-00-01","11-10-00"],"Passing: Brunch/4":["11-10-01","11-15-00"],"4th Period":["11-15-01","12-00-00"],"Passing: 4/5":["12-00-01","12-05-00"],"5th Period":["12-05-01","12-50-00"],"Lunch":["12-50-01","13-25-00"],"Passing: Lunch/6":["13-25-01","13-30-00"],"6th Period":["13-30-01","14-15-00"],"Passing: 6/7":["14-15-01","14-20-00"],"7th Period":["14-20-01","15-05-00"]},"TUE":{"1st Period":["8-00-00","9-30-00"],"Passing: 1/2":["9-30-01","9-40-00"],"2nd Period":["9-40-01","11-10-00"],"Brunch":["11-10-01","11-15-00"],"Passing: Brunch/3":["11-15-01","11-25-00"],"3rd Period":["11-25-01","12-55-00"],"Lunch":["12-55-01","13-25-00"],"Passing: Lunch/7":["13-25-01","13-35-00"],"7th Period":["13-35-01","15-05-00"]},"WED":{"4th Period":["8-00-00","10-05-00"],"Passing: 4/Academy":["10-05-01","10-15-00"],"Academy":["10-15-01","11-10-00"],"Brunch":["11-10-01","11-15-00"],"Passing: Brunch/5":["11-15-01","11-25-00"],"5th Period":["11-25-01","12-55-00"],"Lunch":["12-55-01","13-25-00"],"Passing: Lunch/6":["13-25-01","13-35-00"],"6th Period":["13-35-01","15-05-00"]},"THU":{"1st Period":["8-00-00","9-30-00"],"Passing: 1/2":["9-30-01","9-40-00"],"2nd Period":["9-40-01","11-10-00"],"Brunch":["11-10-01","11-15-00"],"Passing: Brunch/3":["11-15-01","11-25-00"],"3rd Period":["11-25-01","12-55-00"],"Lunch":["12-55-01","13-25-00"],"Passing: Lunch/7":["13-25-01","13-35-00"],"7th Period":["13-35-01","15-05-00"]},"FRI":{"4th Period":["8-00-00","10-05-00"],"Passing: 4/Academy":["10-05-01","10-15-00"],"Academy":["10-15-01","11-10-00"],"Brunch":["11-10-01","11-15-00"],"Passing: Brunch/5":["11-15-01","11-25-00"],"5th Period":["11-25-01","12-55-00"],"Lunch":["12-55-01","13-25-00"],"Passing: Lunch/6":["13-25-01","13-35-00"],"6th Period":["13-35-01","15-05-00"]}}'
            },
            "ca-auhsd-dls": {
                name: "AUHSD Distance Learning Schedule",
                short_name: "AUHSD Distance",
                icon: "mdi-school",
                color: "#343254",
                schedule:
                    '{"MON": {"Zero Period": ["7-45-00", "8-50-00"], "Virtual Cohort Academy": ["9-00-00", "9-45-00"], "Passing (Virtual Cohort Academy / First Period)": ["9-45-01", "9-59-59"], "First Period": ["10-00-00", "10-40-00"], "Passing (First / Second Periods)": ["10-40-01", "10-44-59"], "Second Period": ["10-45-00", "11-25-00"], "Passing (Second / Third Periods)": ["11-25-01", "11-29-59"], "Third Period": ["11-30-00", "12-10-00"], "Lunch": ["12-10-01", "12-39-59"], "Fourth Period": ["12-40-00", "13-20-00"], "Passing (Fourth / Fifth Periods)": ["13-20-01", "13-24-59"], "Fifth Period": ["13-25-00", "14-05-00"], "Passing (Fifth / Sixth Periods)": ["14-05-01", "14-09-59"], "Sixth Period": ["14-10-00", "14-50-00"], "Passing (Sixth / Seventh Periods)": ["14-50-01", "14-54-59"], "Seventh Period": ["14-55-00", "15-35-00"]}, "TUE": {"First Period": ["9-00-00", "10-15-00"], "Passing (First / Second Periods)": ["10-15-01", "10-29-59"], "Second Period": ["10-30-00", "11-45-00"], "Lunch": ["11-45-01", "12-29-59"], "Third Period": ["12-30-00", "13-45-00"], "Passing (Third / Seventh Periods)": ["13-45-01", "13-59-59"], "Seventh Period": ["14-00-00", "15-15-00"]}, "WED": {"Virtual Academy": ["9-00-00", "9-45-00"], "Passing (Virtual Academy / Fourth Period)": ["9-45-01", "9-59-59"], "Fourth Period": ["10-00-00", "11-15-00"], "Passing (Fourth / Fifth Periods)": ["11-15-01", "11-29-59"], "Fifth Period": ["11-30-00", "12-45-00"], "Lunch": ["12-45-01", "13-29-59"], "Sixth Period": ["13-30-00", "14-45-00"], "Passing (Sixth / Zero Periods)": ["14-45-01", "14-54-59"], "Zero Period": ["14-55-00", "16-00-00"]}, "THU": {"First Period": ["9-00-00", "10-15-00"], "Passing (First / Second Periods)": ["10-15-01", "10-29-59"], "Second Period": ["10-30-00", "11-45-00"], "Lunch": ["11-45-01", "12-29-59"], "Third Period": ["12-30-00", "13-45-00"], "Passing (Third / Seventh Periods)": ["13-45-01", "13-59-59"], "Seventh Period": ["14-00-00", "15-15-00"]}, "FRI": {"Virtual Academy": ["9-00-00", "9-45-00"], "Passing (Virtual Academy / Fourth Period)": ["9-45-01", "9-59-59"], "Fourth Period": ["10-00-00", "11-15-00"], "Passing (Fourth / Fifth Periods)": ["11-15-01", "11-29-59"], "Fifth Period": ["11-30-00", "12-45-00"], "Lunch": ["12-45-01", "13-29-59"], "Sixth Period": ["13-30-00", "14-45-00"], "Passing (Sixth / Zero Periods)": ["14-45-01", "14-54-59"], "Zero Period": ["14-55-00", "16-00-00"]}}'
            }
        }
    }),
    components: {
        Navigation
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    padding: 35px 65px;
}
</style>
