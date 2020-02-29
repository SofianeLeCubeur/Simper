module.exports = {
    name: 'Example',
    types: { // Add custom types
        'sometype': {
            color: 'coloring',
            assertation: function(val){
                return true; // If value's type is correct
            }
        }
    },
    nodes: {
        // Nodes to import in the editor
    },
    inputs: {
        // Input Nodes to import in the editor (those are automatically added to the default input dictionnary)
    }
};