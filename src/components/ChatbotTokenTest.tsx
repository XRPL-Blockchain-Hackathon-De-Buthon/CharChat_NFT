import React, { useState, useEffect } from 'react';
import { 
  getTokenBalance, 
  mintTokens,
  canUseSuperChat,
  useSuperChat,
  getSuperChatThreshold,
  updateSuperChatThreshold
} from '../lib/nftContract';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { getSigner } from '../lib/web3Provider';

export default function ChatbotTokenTest() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [mintAddress, setMintAddress] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const [canUseSuper, setCanUseSuper] = useState<boolean>(false);
  const [superChatThreshold, setSuperChatThreshold] = useState<string>('0');
  const [newThreshold, setNewThreshold] = useState<string>('');

  // 컴포넌트 마운트 시 사용자 주소와 토큰 잔액 가져오기
  useEffect(() => {
    fetchUserAddress();
    fetchSuperChatThreshold();
  }, []);

  useEffect(() => {
    if (userAddress) {
      fetchTokenBalance();
      checkSuperChatEligibility();
    }
  }, [userAddress]);

  // 현재 연결된 사용자 주소 가져오기
  const fetchUserAddress = async () => {
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);
    } catch (error) {
      console.error('사용자 주소 가져오기 실패:', error);
      toast({
        title: '메타마스크 연결 오류',
        description: '지갑에 연결하는데 문제가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 토큰 잔액 가져오기
  const fetchTokenBalance = async () => {
    if (!userAddress) return;

    try {
      setIsLoading(true);
      const result = await getTokenBalance(userAddress);
      if (result.success) {
        setTokenBalance(result.balance);
        toast({
          title: '토큰 잔액 조회 성공',
          description: `잔액: ${result.balance} 토큰`,
        });
      } else {
        toast({
          title: '토큰 잔액 조회 실패',
          description: '오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('토큰 잔액 조회 오류:', error);
      toast({
        title: '토큰 잔액 조회 실패',
        description: '오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 토큰 민팅하기
  const handleMintTokens = async () => {
    if (!mintAddress || !mintAmount) {
      toast({
        title: '입력 오류',
        description: '주소와 금액을 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await mintTokens(mintAddress, mintAmount);
      if (result.success) {
        toast({
          title: '토큰 민팅 성공',
          description: `${mintAmount} 토큰이 ${mintAddress}에 민팅되었습니다.`,
        });
        setMintAddress('');
        setMintAmount('');
        if (mintAddress === userAddress) {
          fetchTokenBalance(); // 현재 사용자에게 민팅한 경우 잔액 업데이트
          checkSuperChatEligibility(); // 슈퍼챗 자격도 다시 확인
        }
      } else {
        toast({
          title: '토큰 민팅 실패',
          description: '오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('토큰 민팅 오류:', error);
      toast({
        title: '토큰 민팅 실패',
        description: '오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 슈퍼챗 사용 가능 여부 확인
  const checkSuperChatEligibility = async () => {
    if (!userAddress) return;

    try {
      setIsLoading(true);
      const result = await canUseSuperChat(userAddress);
      if (result.success) {
        setCanUseSuper(result.canUse);
        toast({
          title: '슈퍼챗 자격 확인 완료',
          description: result.canUse 
            ? '슈퍼챗을 사용할 수 있습니다.' 
            : '슈퍼챗을 사용할 수 없습니다. 토큰이 부족할 수 있습니다.',
        });
      } else {
        toast({
          title: '슈퍼챗 자격 확인 실패',
          description: '오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('슈퍼챗 자격 확인 오류:', error);
      toast({
        title: '슈퍼챗 자격 확인 실패',
        description: '오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 슈퍼챗 사용하기
  const handleUseSuperChat = async () => {
    try {
      setIsLoading(true);
      const result = await useSuperChat();
      if (result.success) {
        toast({
          title: '슈퍼챗 사용 성공',
          description: '슈퍼챗이 성공적으로 사용되었습니다!',
        });
        fetchTokenBalance(); // 토큰 잔액 업데이트
        checkSuperChatEligibility(); // 슈퍼챗 자격 다시 확인
      } else {
        toast({
          title: '슈퍼챗 사용 실패',
          description: '오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('슈퍼챗 사용 오류:', error);
      toast({
        title: '슈퍼챗 사용 실패',
        description: '오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 슈퍼챗 임계값 가져오기
  const fetchSuperChatThreshold = async () => {
    try {
      setIsLoading(true);
      const result = await getSuperChatThreshold();
      if (result.success) {
        setSuperChatThreshold(result.threshold);
        toast({
          title: '슈퍼챗 임계값 조회 성공',
          description: `임계값: ${result.threshold} 토큰`,
        });
      } else {
        toast({
          title: '슈퍼챗 임계값 조회 실패',
          description: '오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('슈퍼챗 임계값 조회 오류:', error);
      toast({
        title: '슈퍼챗 임계값 조회 실패',
        description: '오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 슈퍼챗 임계값 업데이트
  const handleUpdateThreshold = async () => {
    if (!newThreshold) {
      toast({
        title: '입력 오류',
        description: '새 임계값을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await updateSuperChatThreshold(newThreshold);
      if (result.success) {
        setSuperChatThreshold(newThreshold);
        setNewThreshold('');
        toast({
          title: '임계값 업데이트 성공',
          description: `슈퍼챗 임계값이 ${newThreshold} 토큰으로 설정되었습니다.`,
        });
        checkSuperChatEligibility(); // 슈퍼챗 자격 다시 확인
      } else {
        toast({
          title: '임계값 업데이트 실패',
          description: '오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('임계값 업데이트 오류:', error);
      toast({
        title: '임계값 업데이트 실패',
        description: '오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Chatbot Token 테스트</CardTitle>
          <CardDescription>ChatbotToken 컨트랙트와 상호작용</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p><strong>사용자 주소:</strong> {userAddress || '연결되지 않음'}</p>
            <p><strong>토큰 잔액:</strong> {tokenBalance} 토큰</p>
            <p><strong>슈퍼챗 임계값:</strong> {superChatThreshold} 토큰</p>
            <p><strong>슈퍼챗 사용 가능:</strong> {canUseSuper ? '가능' : '불가능'}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button 
            onClick={fetchTokenBalance} 
            disabled={isLoading || !userAddress}
            variant="outline"
          >
            잔액 새로고침
          </Button>
          <Button 
            onClick={checkSuperChatEligibility} 
            disabled={isLoading || !userAddress}
            variant="outline"
          >
            슈퍼챗 자격 확인
          </Button>
        </CardFooter>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>토큰 민팅</CardTitle>
          <CardDescription>컨트랙트 소유자만 토큰을 민팅할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="mint-address">받는 주소</Label>
              <Input
                id="mint-address"
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="mint-amount">민팅할 양</Label>
              <Input
                id="mint-amount"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                placeholder="100"
                type="number"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleMintTokens} 
            disabled={isLoading || !mintAddress || !mintAmount}
            className="w-full"
          >
            {isLoading ? '처리 중...' : '토큰 민팅하기'}
          </Button>
        </CardFooter>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>슈퍼챗 사용</CardTitle>
          <CardDescription>충분한 토큰을 보유한 사용자만 슈퍼챗을 사용할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>슈퍼챗을 사용하면 특별한 AI 응답을 받을 수 있습니다.</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUseSuperChat} 
            disabled={isLoading || !userAddress || !canUseSuper}
            className="w-full"
          >
            {isLoading ? '처리 중...' : '슈퍼챗 사용하기'}
          </Button>
        </CardFooter>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>슈퍼챗 임계값 업데이트</CardTitle>
          <CardDescription>컨트랙트 소유자만 임계값을 업데이트할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="new-threshold">새 임계값 (토큰)</Label>
              <Input
                id="new-threshold"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                placeholder="50"
                type="number"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpdateThreshold} 
            disabled={isLoading || !newThreshold}
            className="w-full"
          >
            {isLoading ? '처리 중...' : '임계값 업데이트'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 