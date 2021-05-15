/*
 * @Author: 王正荣
 * @Email: 1614699407@qq.com
 * @Date: 2021-05-10 22:10:50
 * @LastAuthor: 王正荣
 * @LastTime: 2021-05-15 21:16:01
 * @message: 主页面
 */
import React, { useState } from 'react';
import { Input, Button, Modal } from 'antd';
import axios from 'axios';
import 'antd/dist/antd.css';
import GraphArea from './components/Grahp';

const MainPage = () => {

  const [content, setContent] = useState();
  const [messageErr, setMessageErr] = useState();
  const [modalvisial, setModalvisial] = useState(false);
  const [resultFirstOrderArr, setResultFirstOrderArr] = useState();
  const [newData, setNewData] = useState();
  const [relation, setRelation] = useState();

  const getIMPProgrammer = () => {
    if (!content) {
      setMessageErr('请输入IMP程序段');
    } else {
      setMessageErr('解析IMP程序段出错');
    }
    axios({
      method: 'get',
      url: 'http://120.55.166.23:8080/impToFirstOrderFormula',
      params: {
        programInputString: content
      }
    }).then((res) => {
      const result = res.data.data;
      const newArray = [];
      result.resultFirstOrder.map((item) => {
        newArray.push('\n' + item.firstOrderLogicStr);
        return null;
      });
      setResultFirstOrderArr(newArray);
      getNewData(result.kripkeStructure);
    }).catch(() => {
      setModalvisial(true);
    });
  }

  const getNewData = (kripkeStructure) => {
    const nodes = [];
    kripkeStructure.forEach((item, index) => {
      nodes.push({
        id: (index + 1).toString(),
        label: item.vertex
      });
    });
    const tmpEdges = [];
    kripkeStructure.forEach((item) => {
      const i = nodes.findIndex((inde) => inde.label === item.vertex);
      if (!item.nextKSStatusList) return;
      item.nextKSStatusList.forEach((subItem) => {
        if (subItem) {
          const j = nodes.findIndex((inde) => inde.label === subItem.vertex);
          tmpEdges.push({
            source: (i + 1).toString(),
            target: (j + 1).toString(),
          });
        }
      });
    });
    const edges = tmpEdges.map((item) => {
      if (item.source === item.target) {
        return {
          ...item,
          type: 'loop'
        }
      } else {
        return item;
      }
    });
    setNewData({ nodes, edges });
    getKSStructure(nodes, tmpEdges);
  }

  const getKSStructure = (nodes, edges) => {
    const newMap = new Map();
    nodes.forEach((item) => {
      newMap.set(item.id, item.label);
    });
    const arr = [];
    edges.forEach((item) => {
      arr.push('(' + newMap.get(item.source) + ') ---> (' + newMap.get(item.target) + ')');
    });
    setRelation(arr);
  }
  
  return (
    <React.Fragment>
      <Input.TextArea
        style={{
          height: '400px',
          width: '200px'
        }}
        label='IMP程序段'
        name='impblock'
        onChange={(event) => { setContent(event.target.value) }}
      />
      <Button
        type="primary"
        style={{
          position: 'absolute',
          left: '220px',
          top: '200px'
        }}
        onClick={getIMPProgrammer}
      >
        生成
      </Button>
      <Input.TextArea
        style={{
          position: 'absolute',
          height: '400px',
          left: '300px',
          width: '650px',
          color: 'black'
        }}
        label='一阶逻辑公式'
        name='firstorder'
        disabled={true}
        value={resultFirstOrderArr ? '一阶逻辑公式：' + resultFirstOrderArr : ''}
      />
      <Input.TextArea
        style={{
          position: 'absolute',
          height: '400px',
          left: '1000px',
          width: '260px',
          color: 'black'
        }}
        label='KS结构'
        name='ksstructure'
        disabled={true}
        value={relation ? 'KS结构\n' + relation : ''}
      />
      <Modal
        visible={modalvisial}
        okText='我知道了'
        onOk={() => setModalvisial(false)}
        cancelText='取消'
        onCancel={() => setModalvisial(false)}
      >
        <p>{messageErr}</p>
      </Modal>
      {newData && <GraphArea data={newData} />}
    </React.Fragment>
  );
};

export default MainPage;