// Function to fetch data and create plots
async function getPlots(id) {
    try {
        const sampledata = await d3.json("samples.json");
        console.log(sampledata);

        const { otu_ids, sample_values, otu_labels } = sampledata.samples[0];

        const OTU_top = otu_ids.slice(0, 10).reverse();
        const OTU_id = OTU_top.map(d => `OTU ${d}`);
        const sampleValues = sample_values.slice(0, 10).reverse();
        const labels = otu_labels.slice(0, 10);

        // Rest of the code for bar chart
        const trace = {
            x: sampleValues,
            y: OTU_id,
            text: labels,
            marker: { color: 'blue' },
            type: "bar",
            orientation: "h",
        };

        // create data variable
        const data = [trace];

        // create layout variable to set plots layout
        const layout = {
            title: "Top 10 OTU",
            yaxis: { tickmode: "linear" },
            margin: { l: 100, r: 100, t: 100, b: 30 }
        };

        // create the bar plot
        Plotly.newPlot("bar", data, layout);

        // The bubble chart
        const trace1 = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: otu_labels
        };

        // set the layout for the bubble plot
        const layout_2 = {
            xaxis: { title: "OTU ID" },
            height: 600,
            width: 1000
        };

        // creating data variable 
        const data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_2);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Function to get demographic information
async function getDemoInfo(id) {
    try {
        const data = await d3.json("samples.json");
        const metadata = data.metadata;
        const result = metadata.find(meta => meta.id.toString() === id);

        const demographicInfo = d3.select("#sample-metadata");
        demographicInfo.html("");

        Object.entries(result).forEach(([key, value]) => {
            demographicInfo.append("h5").text(`${key.toUpperCase()}: ${value}\n`);
        });
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Function to handle dropdown selection change
function optionChanged(id) {
    getPlots(id);
    getDemoInfo(id);
}

// Function to initialize the page
async function init() {
    try {
        const dropdown = d3.select("#selDataset");
        const data = await d3.json("samples.json");
        console.log(data);

        data.names.forEach(name => {
            dropdown.append("option").text(name).property("value", name);
        });

        getPlots(data.names[0]);
        getDemoInfo(data.names[0]);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Initialize the page
init();
