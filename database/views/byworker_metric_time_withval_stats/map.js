function(doc){
  if(doc.instance_id && doc.metrics && doc.type === 'interval' && doc.timestamp){
    for(var i in doc.metrics){
      emit([doc.instance_id, doc.metrics[i]['name']].concat(doc.timestamp), doc.metrics[i]['val']);
    }
  }
}