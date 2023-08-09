import express from "express";

const router = express();
const templateDir = `${process.cwd()}/editor/templates`;

router.use((req, res, next) => {  
  res.header('Access-Control-Allow-Origin', '*');  
  res.header('Access-Control-Allow-Methods', 'GET, POST');  
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');  
  next();
});

router.set("views", templateDir);

let documents = [];

function getNextId(allDocuments) {
  if (allDocuments.length === 0) {
    return 1;
  }
  return allDocuments[allDocuments.length - 1].id + 1;
}

// router.get("/", (req, res) => {
//   res.render("layout", {
//     documents,
//     isUpdate: false,
//   });
// });

router.get("/new", (req, res) => {
  res.render("partials/form-create", {
    documents,
    newId: getNextId(documents),
    isUpdate: true,
  });
});

// 提交表单
// router.post("/", (req, res) => {
//   let nextId = getNextId(documents);

//   let newDoc = {
//     id: nextId,
//     title: req.body.title || `Untitled document ${nextId}`,
//     text: req.body.text,
//   };
//   documents.push(newDoc);
//   res.redirect(`/editor/${nextId}?new=1`);
// });

// 页面跳转
router.get("/:id", (req, res) => {
  let isHxRequest = req.headers["hx-request"] || false;
  let doc = documents.find((item) => `${item.id}` === req.params.id);

  documents = documents.map((item) => {
    if (`${item.id}` === req.params.id) {
      item.isActive = true;
    } else {
      item.isActive = false;
    }

    return item;
  });

  let isNew = req.query.new === "1";

  if (isHxRequest && isNew) {
    return res.render("partials/detail", {
      documents,
      document: doc,
      isUpdate: true,
    });
  } else if (isHxRequest) {
    return res.render("partials/detail", {
      documents,
      document: doc,
      isUpdate: false,
    });
  }

  res.render("layout", {
    documents,
    document: doc,
    isUpdate: false,
  });
});


// 创建
router.get("/edit/:id", (req, res) => {
  // let doc = documents.find((item) => `${item.id}` === req.params.id);
  // console.log('req.params&query:',req.params,req.query);

  if(req.params.id){
    let newDoc = {
      id: req.params.id,
      title: req.query.title || `Untitled document`,
      text: req.query.text,
    };

    documents.push(newDoc);
  }

  res.render("partials/form-edit", {
    documents,
    newId: getNextId(documents),
    isUpdate: true,
  });
});

// 详情
router.get("/detail/:id", (req, res) => {
  let doc = documents.find((item) => `${item.id}` === req.params.id);
  console.log('doc:',documents,doc);
  console.log('req.params&query333:',req.params,req.query);

  res.render("partials/detail", {
    documents,
    document: doc,
    isUpdate: true,
  });
});

// 修改
router.get("/modify/:id", (req, res) => {
  let doc = documents.find((item) => `${item.id}` === req.params.id);
  // console.log('req111222333:',req);
  // console.log('req.params&query:',req.params,req.query);
  if(doc){
    doc.title = req.query.title;
    doc.text = req.query.text;
  }

  let newId = getNextId(documents);
  res.render("partials/form-edit", {
    documents,
    newId,
    isUpdate: true,
  });
});


export default router;
