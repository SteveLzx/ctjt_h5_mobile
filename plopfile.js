module.exports = plop => {
  plop.setGenerator('vuefile', {
    description: 'create vue file',
    prompts: [
      {
        type: 'list',
        name: 'dirName',
        message: '新建components还是views',
        choices: [
          {
            name: 'views',
            value: 'views'
          },
          {
            name: 'components',
            value: 'components'
          },
        ]
      },
      {
        type: 'list',
        name: 'apiType',
        message: '选择options-api还是compsition-api',
        choices: [
          {
            name: 'options-api',
            value: 'options'
          },
          {
            name: 'compsition-api',
            value: 'compsition'
          },
        ]
      },
      {
        type: 'input',
        name: 'fileName',
        message: '输入文件夹名称,多层用/隔开(从views/components后面开始的文件夹)',
        default: '',
        /* eslint-disable */
        validate: function(value) {
          const done = this.async();
          if (!value) {
            done('请输入文件夹名称');
            return false;
          }
          done(null, true);
          return true;
        }
        /* eslint-enable */
      },
      {
        type: 'input',
        name: 'className',
        message: '输入文件类名(compsition-api略过)',
        default: '',
        /* eslint-disable */
        // validate: function(value) {
        //   console.log(this);
        //   console.log(this.apiType);
        //   if (this.apiType === 'options') {
        //     const done = this.async();
        //     if (!value) {
        //       done('请输入文件夹名称');
        //       return false;
        //     }
        //     done(null, true);
        //     return true;
        //   }
        // }
        /* eslint-enable */
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{dirName}}/{{fileName}}/index.vue',
        templateFile: './plop_template/{{apiType}}.hbs'
      }
    ]
  });
};
