package haengdong.event.domain.bill;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import haengdong.event.domain.event.Event;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    @Query("""
            select b
            from Bill b
            join fetch b.billDetails bd
            join fetch bd.eventMember
            where b.event = :event
            """)
    List<Bill> findAllByEvent(Event event);

    Optional<Bill> findFirstByEventOrderByIdDesc(Event event);
}
