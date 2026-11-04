package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pago")
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Long idPago;

    @NotNull
    @Column(name = "monto_total")
    @Digits(integer = 6, fraction = 2)
    private BigDecimal montoTotal;

    @NotBlank
    @Column(name = "metodo")
    private String metodo;

    @NotBlank
    @Column(name = "estado")
    private String estado;

    @NotBlank
    @Column(name = "ultimos_digitos")
    private String ultimosDigitos;

    @OneToOne
    @JoinColumn(name = "id_turno")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Turno turno;
}