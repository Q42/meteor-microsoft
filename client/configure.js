Template.configureLoginServiceDialogForMicrosoft.helpers({
    siteUrl: function () {
        return Meteor.absoluteUrl() + "_oauth/" + Microsoft.serviceName;
    }
});

Template.configureLoginServiceDialogForMicrosoft.fields = function () {
    return [
        {property: 'clientId', label: 'Client ID'},
        {property: 'secret', label: 'Client secret'}
    ];
};