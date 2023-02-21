import React, { useState, useRef, useCallback, memo } from 'react';
import styled from 'styled-components';
import DetailWriteSearch from './DetailWriteSearch';
import DetailWriteProductCard from './DetailWriteProductCard';
import DetaillWriteImageInput from './DetaillWriteImageInput';
import { listProps } from './DetailWriteSearch';
import axios from 'axios';
import QuillEditor from './DetailWriteFormEditor';
import { collection, addDoc } from 'firebase/firestore';
import { dbService } from '../../shared/firebase';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
axios.defaults.withCredentials = true;

export interface DetailWriteSearchProps {
  item?: listProps;
  list?: any[];
}

// 글쓰기 페이지 폼 함수입니다
const DetailWriteForm = () => {
  // console.log('form 자체');

  // 모달 관리 State
  const [isModalShow, setIsModalShow] = useState(false);
  const [title, setTitle] = useState('');

  // 검색어 state
  const [searchWord, setSearchWord] = useState('');

  // 네이버 데이터 state
  const [data, setData] = useState<any[]>([]);

  // 검색해서 선택한 제품 state
  const [list, setList] = useState<any[]>([]);

  // 검색해서 선택한 제품들을 넣는 state
  const [selectList, setSelectList] = useState<any[]>([]);

  // 직업 선택 state
  const [selectJob, setSelectJob] = useState('');

  /**
   * 인풋창에 작성할 때 딜레이가 안 되게끔 하는 함수
   */
  const inputSearchWord = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('검색 인풋');
      setSearchWord(e.target.value);
    },
    [],
  );

  /**
   * pages/api/datas api로 우회해서 네이버 오픈API 데이터 get해오는 함수
   */
  const getNaverData = async () => {
    const response = await axios
      .get('http://localhost:3000/api/naverData', {
        params: {
          query: searchWord,
        },
      })
      .then((response) => setData(response.data))
      .catch((Error) => console.log(Error));
  };

  // console.log(data);

  // 모달창에서 검색한 제품 선택하기
  const selectProduct = (item: any) => {
    const newList = [...list, item];
    setList(newList);
  };

  // 모달창에서 선택한 제품 삭제하기
  const deleteProduct = (item: any) => {
    const deletedList = list;
    setList(deletedList.filter((i) => i.productId !== item.productId));
  };

  // 모달 보이게 하기
  const showSearchModal = (event: any) => {
    setIsModalShow(true);
  };

  // 모달 숨기기
  const hideSearchModal = () => {
    setIsModalShow(!isModalShow);
  };

  // 모달에서 등록을 누르면 선택한 제품들이 선택되면서 모달이 닫히게 하는 함수
  const selectedProducts = (e: any) => {
    setSelectList(list);
    hideSearchModal();
  };

  // 글쓰기 폼 제목 입력
  const inputTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setTitle(e.target.value);
      console.log('제목 인풋');
    },
    [title],
  );

  // 직업선택 onChange 함수
  const getJob = (e: any) => {
    setSelectJob(e.target.value);
  };

  //글쓰기 폼에서 최종적으로 등록하기 버튼을 누를 때 파이어베이스에 저장되는 놈
  const submitPostForm = async (e: any) => {
    e.preventDefault();
    const docRef = await addDoc(collection(dbService, 'postData'), {
      createdAt: new Date(),
      userId: '11d2sad15s',
      jobCategory: selectJob,
      postTitle: title,
      postText: 'dsda',
      postImage1: 'dsadsa',
      postImage2: 'dsadsads',
      likes: [],
      likesCount: [],
      products: [
        // {
        //   productId: list.productId,
        //   images: list.image,
        //   title: list.title,
        //   url: list.url,
        //   hashTag: list.category2,
        // },
        //수정할 예정
      ],
    });
    console.log('Document written with ID: ', docRef.id);
  };

  return (
    <>
      <DetailWriteLayout onSubmit={submitPostForm}>
        {isModalShow && (
          <DetailWriteSearch
            onClose={hideSearchModal}
            list={list}
            setList={setList}
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            data={data}
            setData={setData}
            inputSearchWord={inputSearchWord}
            getNaverData={getNaverData}
            selectProduct={selectProduct}
            deleteProduct={deleteProduct}
            onClick={selectedProducts}
          />
        )}
        <DetailWriteSelectBox>
          <select className="job_select" onChange={getJob} value={selectJob}>
            <option className="optionOne">선택해주세요</option>
            <option value="developer">개발자</option>
            <option value="designer">디자이너</option>
            <option value="Planner">기획자</option>
            <option value="student">학생</option>
            <option value="etc">기타</option>
          </select>
          <p className="job_span">의 책상</p>
        </DetailWriteSelectBox>
        <DetailWriteTitleInput
          type="text"
          placeholder="제목을 입력해주세요"
          maxLength={30}
          value={title}
          onChange={inputTitle}
        />
        <QuillEditor />
        <DetailWriteBox>
          <span className="title_span">
            테스크테리어 사진을 선택해주세요
            <DetaillWriteImageInput />
          </span>
        </DetailWriteBox>
        <DetailWriteBox>
          <span className="title_span">사용하신 제품을 선택해주세요</span>
          <button onClick={showSearchModal}>기기검색</button>
          <DetailWriteProductCard key={selectList} selectList={selectList} />
        </DetailWriteBox>
        <DetailWriteButtonBox>
          <button className="btn">취소</button>
          <button className="btn">완료</button>
        </DetailWriteButtonBox>
      </DetailWriteLayout>
    </>
  );
};

export default memo(DetailWriteForm);

const DetailWriteLayout = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 80%;
  height: 125vh;
  padding: 0.5rem;
`;

const DetailWriteSelectBox = styled.div`
  display: flex;
  align-items: center;
  width: 75rem;
  height: 3.25rem;

  .job_select {
    width: 7.375rem;
    height: 1.75rem;
    border: 0.0625rem solid #868e96;
    border-radius: 0.625rem;
    padding: 0.25rem 0.5rem;

    &:hover {
      border-color: #206efb;
    }
  }

  .job_span {
    font-size: 1.125rem;
    line-height: 1.25rem;
  }
`;

const DetailWriteTitleInput = styled.input`
  display: flex;
  width: 75rem;
  height: 3.25rem;
  box-sizing: border-box;
  border: 0.125rem solid #868e96;
  border-radius: 0.625rem;
  padding: 0.875rem 1.25rem;
  font-size: 1.375rem;
`;

const DetailWriteButtonBox = styled.div`
  display: flex;
  justify-content: end;
  width: 75rem;
  height: 3.25rem;

  .btn {
    background-color: #206efb;
    border: none;
    border-radius: 0.625rem;
    color: white;
    font-size: 1.25rem;
    line-height: 1.25rem;
    width: 9.375rem;
    height: 3.25rem;
    margin: 0 0.8rem;
    padding: 1rem 2.5rem;

    &:hover {
      color: #206efb;
      background-color: #fff;
    }
  }
`;

const DetailWriteBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 75rem;
  height: 12.5rem;
  margin: 2rem;

  .title_span {
    margin-bottom: 0.625rem;
    font-weight: 700;
    font-size: 1.5rem;
    line-height: 2rem;
  }
`;
