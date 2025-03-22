import React, { useState, useEffect } from 'react';
import { 
  mintInitialNFT, 
  getPromptTemplate, 
  updatePromptTemplate,
  getNFTOwner,
  canUpdatePrompt
} from '../lib/nftContract';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

export default function AIChatbotNFTTest() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const [canUpdate, setCanUpdate] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [isMinted, setIsMinted] = useState<boolean>(false);

  // 컴포넌트 마운트 시 프롬프트 템플릿 가져오기
  useEffect(() => {
    fetchPromptTemplate();
    fetchNFTOwner();
  }, []);

  // 프롬프트 템플릿 가져오기
  const fetchPromptTemplate = async () => {
    try {
      setIsLoading(true);
      const result = await getPromptTemplate();
      if (result.success) {
        setPrompt(result.promptTemplate);
        toast({
          title: "프롬프트 템플릿 가져오기 성공",
          description: "현재 프롬프트 템플릿을 가져왔습니다.",
        });
      } else {
        toast({
          title: "프롬프트 템플릿 가져오기 실패",
          description: "오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("프롬프트 템플릿 가져오기 오류:", error);
      toast({
        title: "프롬프트 템플릿 가져오기 실패",
        description: "오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // NFT 소유자 가져오기
  const fetchNFTOwner = async () => {
    try {
      setIsLoading(true);
      const result = await getNFTOwner();
      if (result.success) {
        setOwner(result.owner);
        setIsMinted(true);
        toast({
          title: "NFT 소유자 조회 성공",
          description: `소유자: ${result.owner}`,
        });
      }
    } catch (error) {
      console.error("NFT 소유자 조회 오류:", error);
      setIsMinted(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 프롬프트 템플릿 업데이트
  const handleUpdatePrompt = async () => {
    if (!newPrompt) {
      toast({
        title: "입력 오류",
        description: "새 프롬프트를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await updatePromptTemplate(newPrompt);
      if (result.success) {
        setPrompt(newPrompt);
        setNewPrompt('');
        toast({
          title: "프롬프트 업데이트 성공",
          description: "프롬프트가 성공적으로 업데이트되었습니다.",
        });
      } else {
        toast({
          title: "프롬프트 업데이트 실패",
          description: "오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("프롬프트 업데이트 오류:", error);
      toast({
        title: "프롬프트 업데이트 실패",
        description: "오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 NFT 민팅
  const handleMintNFT = async () => {
    try {
      setIsLoading(true);
      const result = await mintInitialNFT();
      if (result.success) {
        toast({
          title: "NFT 민팅 성공",
          description: "초기 NFT가 성공적으로 민팅되었습니다.",
        });
        fetchNFTOwner(); // NFT 소유자 정보 업데이트
      } else {
        toast({
          title: "NFT 민팅 실패",
          description: "오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("NFT 민팅 오류:", error);
      toast({
        title: "NFT 민팅 실패",
        description: "오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 프롬프트 업데이트 권한 확인
  const checkCanUpdatePrompt = async () => {
    if (!userAddress) {
      toast({
        title: "입력 오류",
        description: "주소를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await canUpdatePrompt(userAddress);
      if (result.success) {
        setCanUpdate(result.canUpdate);
        toast({
          title: "권한 확인 완료",
          description: result.canUpdate 
            ? "해당 주소는 프롬프트를 업데이트할 수 있습니다." 
            : "해당 주소는 프롬프트를 업데이트할 수 없습니다.",
        });
      } else {
        toast({
          title: "권한 확인 실패",
          description: "오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("권한 확인 오류:", error);
      toast({
        title: "권한 확인 실패",
        description: "오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Chatbot NFT 테스트</CardTitle>
          <CardDescription>AIChatbotNFT 컨트랙트와 상호작용</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p><strong>현재 상태:</strong> {isMinted ? '민팅됨' : '민팅 안됨'}</p>
            {isMinted && <p><strong>소유자:</strong> {owner}</p>}
            <p><strong>현재 프롬프트:</strong> {prompt || '(비어 있음)'}</p>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          {!isMinted && (
            <div className="w-full">
              <Button 
                onClick={handleMintNFT} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? '처리 중...' : '초기 NFT 민팅하기'}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>프롬프트 업데이트</CardTitle>
          <CardDescription>NFT 소유자만 프롬프트를 업데이트할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="new-prompt">새 프롬프트</Label>
              <Input
                id="new-prompt"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="새 프롬프트 입력..."
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpdatePrompt} 
            disabled={isLoading || !newPrompt}
            className="w-full"
          >
            {isLoading ? '처리 중...' : '프롬프트 업데이트'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>프롬프트 업데이트 권한 확인</CardTitle>
          <CardDescription>주소가 프롬프트를 업데이트할 수 있는지 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="user-address">주소 입력</Label>
              <Input
                id="user-address"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
            {userAddress && (
              <p><strong>업데이트 권한:</strong> {canUpdate ? '있음' : '없음'}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={checkCanUpdatePrompt} 
            disabled={isLoading || !userAddress}
            className="w-full"
          >
            {isLoading ? '처리 중...' : '권한 확인하기'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 